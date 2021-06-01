// Loopback imports
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { AnyObject, Filter, repository, WhereBuilder } from '@loopback/repository';
import { post, param, Request, Response, get, getFilterSchemaFor, getModelSchemaRef, del, requestBody, RestBindings, HttpErrors } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
// GPP imports
import { DocumentRepository, DocumentEncryptedChunksRepository, UserTokenRepository, UserTokenDocumentRepository, UserRepository } from '../repositories';
import { PermissionKeys } from '../authorization/permission-keys';
import { DocumentEncryptedChunk, User, UserToken} from '../models';
import { Document } from '../models'
import { getFilesAndFields } from '../services/file-upload.service';
import { MEMORY_UPLOAD_SERVICE } from '../keys';
import { MemoryUploadHandler, TempFile } from '../types';
import { chunkString } from '../services/string-util';
import { decrypt, encrypt, decryptString } from '../services/zenroom-service';
import { uploadStringToIPFS } from '../services/ipfs-service';
import { writeIntoBlockchain } from '../services/sawroom-service';
import { TokenServiceBindings } from '../authorization/keys';
import { JWTService } from '../services/jwt-service';
import { ATTACHMENT_FILENAME, BASE64_ENCODING, CHUNK_MAX_CHAR_SIZE, USER_BLOCK_REQUEST_TOKEN_DEFAULT_VALIDITY_IN_MINS, MINUTES_IN_MILLISECONDS } from '../constants';

interface DownloadDocumentData {
  idDocument: string;
  privateKey: string;
}

export class DocumentController {
  constructor(
    @repository(DocumentRepository) public documentRepository : DocumentRepository,
    @repository(DocumentEncryptedChunksRepository) public documentEncryptedChunkRepository : DocumentEncryptedChunksRepository,
    @repository(UserTokenRepository) public userTokenRepository : UserTokenRepository,
    @repository(UserTokenDocumentRepository) public userTokenDocumentRepository : UserTokenDocumentRepository,
    @repository(UserRepository) public userRepository : UserRepository,
    @inject(SecurityBindings.USER) public user: UserProfile,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: JWTService,
    @inject(MEMORY_UPLOAD_SERVICE) private memoryUploadHandler: MemoryUploadHandler,
  ) {}
  
  //*** UPLOAD DOCUMENT ***/
  @post('/documents/upload', {
    responses: {
      200: {
        content: {'application/json': {schema: {type: 'object'}}},
        description: 'User document upload',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.DocWalletManagement] })
  async fileUpload(
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile
  ): Promise<object> {
    // File upload
    return new Promise<object>((resolve, reject) => {
      this.memoryUploadHandler(request, response, (err) => {
        if (err) {
          // Multer error
          resolve(err);
        } else {
          // Get all the file informations
          const filesAndFields = getFilesAndFields(request);
          if (filesAndFields.files.length > 0) {
            // Get the first file informations
            const fileUploaded = filesAndFields.files[0];
            
            // Apply the base64 encoding to the file
            const contents : string = fileUploaded.buffer.toString(BASE64_ENCODING);
            let indexId = 0;
            
            // Save the document
            this.saveDocument(currentUser.idUser, filesAndFields.fields.title, fileUploaded).then((createdDocument:Document) => {
              // Generate chunk files
              const stringChunks : RegExpMatchArray | null = chunkString(contents, CHUNK_MAX_CHAR_SIZE);    
              stringChunks!.forEach((element: string) => {
                const encryptedObject = encrypt(element, filesAndFields.fields.privateKey);     
                encryptedObject.indexId = indexId;
                indexId++;
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.saveDocumentChunk(encryptedObject, createdDocument.idDocument);
              }); 
              resolve(createdDocument);
            }).catch(errDocument => console.log(errDocument));
          }
        }
      });
    });
  }

  //*** LIST ***/
  @get('/documents', {
    responses: {
      '200': {
        description: 'Array of Document model instances',
        content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(Document, {includeRelations: true})}}}
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.DocWalletManagement] })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(Document)) filter?: Filter<Document>,
  ): Promise<Document[]> {
    if (filter === undefined) {
      filter = {};
    }
    if (filter.where === undefined) {
      filter.where = {};
    }
    const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
    const where = queryFilters.impose({ idUser: currentUser.idUser }).build();
    filter.where = where;
    return this.documentRepository.find(filter);
  }

  //*** LIST BY TOKEN ***/
  @get('/documents/operator/{token}', {
    responses: {
      '200': {
        description: 'Array of Document model instances by token',
        content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(Document, {includeRelations: true})}}}
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.CheckTokenDocWallet] })
  async findByToken(
    @param.path.string('token') token: string,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile
  ): Promise<Document[]> {
    // Check if the user is blocked
    const userAllowed: boolean = await this.verifyUserCheckTokenAllowed(currentUser);

    if (userAllowed) {
      // Get the specified token
      const userTokenFilter: Filter = { where: { "token": token } };
      const foundToken = await this.userTokenRepository.findOne(userTokenFilter);

      if (foundToken) {
        const userToken: UserToken = this.checkAndExtractUserToken(foundToken);

        // Reset the user attempts
        this.updateCheckTokenUserAttempts(currentUser, 0);

        let documentsList: Document[] = [];

        // Get the documents relative to the token
        const userTokenDocumentFilter: Filter = { where: { "idUserToken": userToken.idUserToken }};
        const userTokenDocuments = await this.userTokenDocumentRepository.find(userTokenDocumentFilter);
        
        for (const key in userTokenDocuments) {
          const idDocument : string = userTokenDocuments[key]['idDocument'];

          // Get the current document information
          const documentFilter: Filter = { where: { "idDocument": idDocument }};
          const document = await this.documentRepository.findOne(documentFilter);

          if (document) {
            documentsList.push(document);
          }
        }

        return documentsList;
      } else {
        // Update the user attempts
        this.updateCheckTokenUserAttempts(currentUser, 1);
        throw new HttpErrors.NotFound("Invalid token");
      }
    } else {
      throw new HttpErrors.TooManyRequests("Too many wrong requests");
    }
  }

  //*** DOWNLOAD FILE BY TOKEN ***/
  @get('/documents/{id}/operator/{token}')
  @authenticate('jwt', { required: [PermissionKeys.CheckTokenDocWallet] })
  async downloadOperator(
    @param.path.string('token') token: string,
    @param.path.string('id') id: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(Document)) filter?: Filter<Document>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    // Check if the user is blocked
    const userAllowed: boolean = await this.verifyUserCheckTokenAllowed(currentUser);

    if (userAllowed) {
      const userTokenFilter: Filter = { where: { "token": token } };
      const foundToken = await this.userTokenRepository.findOne(userTokenFilter);

      if (foundToken) {
        const userToken: UserToken = this.checkAndExtractUserToken(foundToken);

        // Check if document id is associated to the token
        const userTokenDocumentFilter: Filter = { where: { "idUserToken": foundToken.idUserToken, "idDocument": id}};
        const foundUserTokenDocument = await this.userTokenDocumentRepository.find(userTokenDocumentFilter);

        if (foundUserTokenDocument.length > 0) {
          if (filter === undefined) {
            filter = {};
          }
          if (filter.where === undefined) {
            filter.where = {};
          }
          const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
          const where = queryFilters.impose({ idDocument: id, idUser: userToken.idUser }).build();
          filter.where = where;

          const documents = await this.documentRepository.find(filter);
          if(documents.length !== 1){
            throw new HttpErrors.NotFound("No documents found for that id and idUser");
          }

          // Decrypt the privateKey
          const privateKey = await decryptString(userToken.key, userToken.checksum, userToken.header, userToken.iv, userToken.idUserToken);

          const document = documents[0];
          const fileName : string = document.filename;
          const contentType : string = document.mimeType;

          const chunksFilter: Filter = { where: { 
              "idDocument": id
            },
            order: ['chunkIndexId ASC']
          };

          const encryptedChunks : DocumentEncryptedChunk[] = await this.documentEncryptedChunkRepository.find(chunksFilter);
          let textDecrypted = "";

          for await (const chunk of encryptedChunks) {
            const result = await decrypt(chunk, privateKey.textDecrypted);
            textDecrypted = textDecrypted + result.textDecrypted;
          }
      
          const fileContents = Buffer.from(textDecrypted, BASE64_ENCODING);
          response.writeHead(200, {
            'Content-disposition': ATTACHMENT_FILENAME + fileName,
            'Content-Type': contentType,
            'Content-Length': fileContents.length
          });
          response.end(fileContents);
        } else {
          // Update the user attempts
          this.updateCheckTokenUserAttempts(currentUser, 1);
          throw new HttpErrors.Unauthorized("Token not associated to document");
        }
      } else {
        throw new HttpErrors.NotFound("Invalid token");
      }
    } else {
      throw new HttpErrors.TooManyRequests("Too many wrong requests");
    }
  }

  //*** DOWNLOAD ***/
  @post('/documents/download', {
    responses: {
      200: {
        content: {'application/json': {schema: {type: 'object'}}},
        description: 'User document download',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.DocWalletManagement] })
  async download(
    @requestBody() downloadDocumentData: DownloadDocumentData,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
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
 
    const fileContents = Buffer.from(textDecrypted, BASE64_ENCODING);
    response.writeHead(200, {
      'Content-disposition': ATTACHMENT_FILENAME + fileName,
      'Content-Type': contentType,
      'Content-Length': fileContents.length
    });
    response.end(fileContents);
  }

  //*** DOWNLOAD ***/
  @post('/documents/download-base64', {
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
  }

  //*** DELETE ***/
  @del('/documents/{id}', {
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

  private async saveDocument(idUser: string, title: string, fileUploaded: TempFile) : Promise<Document>{
    const newDocument: Document = new Document();
    newDocument.idUser = idUser;
    newDocument.title = title;
    newDocument.filename = fileUploaded.originalname;
    newDocument.mimeType = fileUploaded.mimetype;
    newDocument.size = fileUploaded.size;
    newDocument.mimeType = fileUploaded.mimetype;
    return this.documentRepository.save(newDocument);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async saveDocumentChunk(objectToSave: any, documentUUIDReference: string) : Promise<DocumentEncryptedChunk> {
    const documentsEncryptedChunk: DocumentEncryptedChunk = new DocumentEncryptedChunk();
    documentsEncryptedChunk.header = objectToSave.secret_message.header;
    documentsEncryptedChunk.text = objectToSave.secret_message.text;
    documentsEncryptedChunk.checksum = objectToSave.secret_message.checksum;
    documentsEncryptedChunk.iv = objectToSave.secret_message.iv;
    documentsEncryptedChunk.idDocument = documentUUIDReference;
    documentsEncryptedChunk.chunkIndexId = objectToSave.indexId;
    documentsEncryptedChunk.ipfsPath = await uploadStringToIPFS(documentsEncryptedChunk.text!);

    let jsonToSave = {
      "header": documentsEncryptedChunk.header,
      "checksum": documentsEncryptedChunk.checksum,
      "iv": documentsEncryptedChunk.iv,
      "ipfsPath": documentsEncryptedChunk.ipfsPath
    }

    documentsEncryptedChunk.transactionId = await writeIntoBlockchain(jsonToSave);
    if(documentsEncryptedChunk.transactionId){
      documentsEncryptedChunk.status = 'PENDING';
    }

    return this.documentEncryptedChunkRepository.save(documentsEncryptedChunk);
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
  }
}
