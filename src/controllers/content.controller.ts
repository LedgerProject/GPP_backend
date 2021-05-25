// Loopback imports
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { AnyObject, Filter, repository, WhereBuilder } from '@loopback/repository';
import { post, patch, param, Request, Response, get, getFilterSchemaFor, getModelSchemaRef, del, requestBody, RestBindings, HttpErrors } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
// GPP imports
import { ContentRepository, ContentMediaRepository, ContentMediaEncryptedChunksRepository, UserRepository } from '../repositories';
import { PermissionKeys } from '../authorization/permission-keys';
import { Content, ContentMedia, ContentMediaEncryptedChunk, User} from '../models';
import { checkContentOwner } from '../services/content.service';
import { getFilesAndFields } from '../services/file-upload.service';
import { MEMORY_UPLOAD_SERVICE } from '../keys';
import { MemoryUploadHandler, TempFile } from '../types';
import { chunkString, generateFixedLengthRandomString } from '../services/string-util';
import { decrypt, encrypt, decryptString } from '../services/zenroom-service';
import { uploadStringToIPFS } from '../services/ipfs-service';
import { writeIntoBlockchain } from '../services/sawroom-service';
import { TokenServiceBindings } from '../authorization/keys';
import { JWTService } from '../services/jwt-service';
import { ATTACHMENT_FILENAME, BASE64_ENCODING, CHUNK_MAX_CHAR_SIZE } from '../constants';

export class ContentController {
  constructor(
    @repository(ContentRepository) public contentRepository : ContentRepository,
    @repository(ContentMediaRepository) public contentMediaRepository : ContentMediaRepository,
    @repository(ContentMediaEncryptedChunksRepository) public contentMediaEncryptedChunkRepository : ContentMediaEncryptedChunksRepository,
    @repository(UserRepository) public userRepository : UserRepository,
    @inject(SecurityBindings.USER) public user: UserProfile,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: JWTService,
    @inject(MEMORY_UPLOAD_SERVICE) private memoryUploadHandler: MemoryUploadHandler,
  ) {}

  //*** INSERT ***/
  @post('/contents', {
    responses: {
      '200': {
        description: 'Content model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Content) } }
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.ContentCreation] })
  async create(
    @requestBody({
      content: { 'application/json': { schema: getModelSchemaRef(Content, {
        title: 'NewContent',
        exclude: ['idContent'],
      })}}
    })
    content: Omit<Content, 'idContent'>,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile
  ): Promise<Content> {
    // Assign the current user id
    content.idUser = currentUser.idUser;

    // Set the insert date
    content.insertDate = new Date().getTime();

    return this.contentRepository.create(content);
  }

  //*** UPDATE ***/
  @patch('/contents/{id}', {
    responses: {
      '204': {
        description: 'Content PATCH success',
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.ContentUpdate] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': { schema: getModelSchemaRef(Content, { partial: true })}
      }
    })
    content: Content,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile
  ): Promise<void> {
    // Check if it is an owned content
    const contentOwned = await checkContentOwner(id, currentUser.idUser, this.contentRepository);

    if (!contentOwned) {
      throw new HttpErrors.Forbidden("Content not owned");
    }

    await this.contentRepository.updateById(id, content);
  }

  //*** LIST ***/
  @get('/contents', {
    responses: {
      '200': {
        description: 'Array of Content model instances',
        content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(Content, {includeRelations: true})}}}
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralContentManagement, PermissionKeys.ContentsList] })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(Content)) filter?: Filter<Content>,
  ): Promise<Content[]> {
    if (currentUser.userType === 'user') {
      if (filter === undefined) {
        filter = {};
      }
      if (filter.where === undefined) {
        filter.where = {};
      }
      const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
      const where = queryFilters.impose({ idUser: currentUser.idUser }).build();
      filter.where = where;
    }
    //
    return this.contentRepository.find(filter);
  }
  
  //*** UPLOAD FILE ***/
  @post('/contents/upload/{id}', {
    responses: {
      200: {
        content: {'application/json': {schema: {type: 'object'}}},
        description: 'User content file upload',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.ContentUpdate] })
  async fileUpload(
    @param.path.string('id') id: string,
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile
  ): Promise<object> {
    // File upload
    return new Promise<object>((resolve, reject) => {
      this.memoryUploadHandler(request, response, async (err) => {
        if (err) {
          // Multer error
          resolve(err);
        } else {
          // Check if it is an owned content
          const contentOwned = await checkContentOwner(id, currentUser.idUser, this.contentRepository);

          if (!contentOwned) {
            throw new HttpErrors.Forbidden("Content not owned");
          }

          // Get all the file informations
          const filesAndFields = getFilesAndFields(request);

          if (filesAndFields.files.length > 0) {
            // Get the first file informations
            const fileUploaded = filesAndFields.files[0];

            // Generate a random string
            const randomString = generateFixedLengthRandomString('0123456789abcdefghijklmnopqrstuvwxyz', 10);

            // Apply the base64 encoding to the file
            const contents : string = fileUploaded.buffer.toString(BASE64_ENCODING);
            let indexId = 0;

            // Save the content
            this.saveContentMedia(id, randomString, fileUploaded).then((createdContentMedia:ContentMedia) => {
              // Generate chunk files
              const stringChunks : RegExpMatchArray | null = chunkString(contents, CHUNK_MAX_CHAR_SIZE);    
              stringChunks!.forEach((element: string) => {
                const encryptedObject = encrypt(element, randomString);     
                encryptedObject.indexId = indexId;
                indexId++;
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.saveContentMediaChunk(encryptedObject, id);
              }); 
              
              resolve(createdContentMedia);
            }).catch(errDocument => console.log(errDocument));
          }
        }
      });
    });
  }

  //*** DOWNLOAD ***/
  /*@post('/contents/download/{id}', {
    responses: {
      200: {
        content: {'application/json': {schema: {type: 'object'}}},
        description: 'User content photo download',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.ContentDetail, PermissionKeys.GeneralContentManagement] })
  async download(
    @param.path.string('id') id: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(Content)) filter?: Filter<Content>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    if (filter === undefined) {
      filter = {};
    }
    if (filter.where === undefined) {
      filter.where = {};
    }
    const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
    const where = queryFilters.impose({ idContent: id, idUser: currentUser.idUser }).build();
    filter.where = where;

    const contents = await this.contentRepository.findOne(filter);
    if(!contents){
      throw new HttpErrors.NotFound("No contents found for that id and idUser");
    }

    const fileName : string = document.filename;
    const contentType : string = document.mimeType;

    const chunksFilter: Filter = { where: { 
        "idDocument": downloadDocumentData.idDocument
      },
      order: ['chunkIndexId ASC']
    };
    const encryptedChunks : DocumentEncryptedChunk[] = await this.documentEncryptedChunkRepository.find(chunksFilter);
    let textDecrypted = "";

    for await (const chunk of encryptedChunks) {
      const result = await decrypt(chunk, downloadDocumentData.privateKey);
      textDecrypted = textDecrypted + result.textDecrypted;
    }
 
    const fileContents = Buffer.from(textDecrypted, BASE64_ENCODING);
    response.writeHead(200, {
      'Content-disposition': ATTACHMENT_FILENAME + fileName,
      'Content-Type': contentType,
      'Content-Length': fileContents.length
    });
    response.end(fileContents);
  }*/

  //*** DOWNLOAD ***/
  /*@post('/documents/download-base64', {
    responses: {
      200: {
        content: {'application/json': {schema: {type: 'object'}}},
        description: 'User document base64 download',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.DocWalletManagement] })
  async downloadBase64(
    @requestBody() downloadDocumentData: DownloadDocumentData,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.object('filter', getFilterSchemaFor(Document)) filter?: Filter<Document>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    if (filter === undefined) {
      filter = {};
    }
    if (filter.where === undefined) {
      filter.where = {};
    }
    const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
    const where = queryFilters.impose({ idDocument: downloadDocumentData.idDocument, idUser: currentUser.idUser }).build();
    filter.where = where;

    const documents = await this.documentRepository.find(filter);
    if(documents.length !== 1){
      throw new HttpErrors.NotFound("No documents found for that id and idUser");
    }
    const document = documents[0];

    const fileName : string = document.filename;
    const contentType : string = document.mimeType;

    const chunksFilter: Filter = { where: { 
        "idDocument": downloadDocumentData.idDocument
      },
      order: ['chunkIndexId ASC']
    };
    const encryptedChunks : DocumentEncryptedChunk[] = await this.documentEncryptedChunkRepository.find(chunksFilter);
    let textDecrypted = "";

    for await (const chunk of encryptedChunks) {
      const result = await decrypt(chunk, downloadDocumentData.privateKey);
      textDecrypted = textDecrypted + result.textDecrypted;
    }

    response.end(textDecrypted);
  }*/

  //*** DELETE ***/
  /*@del('/documents/{id}', {
    responses: {
      '204': {
        description: 'Document DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.DocWalletManagement] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.documentRepository.deleteById(id);
  }

  private checkAndExtractUserToken(foundToken: UserToken) {
    const currentDate = new Date();

    const userToken: UserToken = foundToken;
    if (!userToken.validUntil) {
      throw new HttpErrors.NotFound("Invalid token");
    }

    const validUntilDate = new Date(userToken.validUntil);

    if (currentDate > validUntilDate) {
      throw new HttpErrors.NotFound("Token is expired");
    }
    return userToken;
  }

  private async verifyUserCheckTokenAllowed(currentUser : UserProfile) : Promise<boolean> {
    const userFilter: Filter = { where: { "idUser": currentUser.idUser } };
    const foundUser = await this.userRepository.findOne(userFilter);

    if (foundUser) {
      const tokenCheckBlockedUntil = foundUser.tokenCheckBlockedUntil;

      if (tokenCheckBlockedUntil) {
        const currentDate = new Date();
        const tokenCheckBlockedUntilDate = new Date(tokenCheckBlockedUntil);

        if (currentDate < tokenCheckBlockedUntilDate) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  private async updateCheckTokenUserAttempts(currentUser : UserProfile, attemps : number) {
    const userFilter: Filter = { where: { "idUser": currentUser.idUser } };
    const foundUser = await this.userRepository.findOne(userFilter);

    if (foundUser) {
      let tokenAttempts = foundUser.tokenAttempts;

      if (!tokenAttempts) {
        tokenAttempts = 0;
      }

      if (attemps > 0) {
        foundUser.tokenAttempts = tokenAttempts + attemps;
      } else {
        foundUser.tokenAttempts = 0;
      }

      if (tokenAttempts >= 4) {
        foundUser.tokenAttempts = 0;
        foundUser.tokenCheckBlockedUntil = new Date(new Date().getTime() + USER_BLOCK_REQUEST_TOKEN_DEFAULT_VALIDITY_IN_MINS * MINUTES_IN_MILLISECONDS).getTime();
      }

      await this.userRepository.updateById(foundUser.idUser, foundUser);
    }
  }*/

  private async saveContentMedia(idContent: string, key: string, fileUploaded: TempFile) : Promise<ContentMedia>{
    const newContentMedia: ContentMedia = new ContentMedia();
    newContentMedia.idContent = idContent;
    newContentMedia.filename = fileUploaded.originalname;
    newContentMedia.mimeType = fileUploaded.mimetype;
    newContentMedia.size = fileUploaded.size;
    newContentMedia.mimeType = fileUploaded.mimetype;
    newContentMedia.key = key;
    return this.contentMediaRepository.save(newContentMedia);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async saveContentMediaChunk(objectToSave: any, contentMediaUUIDReference: string) : Promise<ContentMediaEncryptedChunk> {
    const contentMediaEncryptedChunk: ContentMediaEncryptedChunk = new ContentMediaEncryptedChunk();
    contentMediaEncryptedChunk.header = objectToSave.secret_message.header;
    contentMediaEncryptedChunk.text = objectToSave.secret_message.text;
    contentMediaEncryptedChunk.checksum = objectToSave.secret_message.checksum;
    contentMediaEncryptedChunk.iv = objectToSave.secret_message.iv;
    contentMediaEncryptedChunk.idContent = contentMediaUUIDReference;
    contentMediaEncryptedChunk.chunkIndexId = objectToSave.indexId;
    contentMediaEncryptedChunk.ipfsPath = await uploadStringToIPFS(contentMediaEncryptedChunk.text!);

    let jsonToSave = {
      "header": contentMediaEncryptedChunk.header,
      "checksum": contentMediaEncryptedChunk.checksum,
      "iv": contentMediaEncryptedChunk.iv,
      "ipfsPath": contentMediaEncryptedChunk.ipfsPath
    }

    contentMediaEncryptedChunk.transactionId = await writeIntoBlockchain(jsonToSave);
    if(contentMediaEncryptedChunk.transactionId){
      contentMediaEncryptedChunk.status = 'PENDING';
    }

    return this.contentMediaEncryptedChunkRepository.save(contentMediaEncryptedChunk);
  }
}
