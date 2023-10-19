// Loopback imports
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { AnyObject, Filter, repository, WhereBuilder } from '@loopback/repository';
import { post, patch, param, Request, Response, get, getFilterSchemaFor, getModelSchemaRef, del, requestBody, RestBindings, HttpErrors } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
// GPP imports
import { ContentRepository, ContentMediaRepository, ContentMediaEncryptedChunksRepository, UserRepository } from '../repositories';
import { PermissionKeys } from '../authorization/permission-keys';
import { Content, ContentMedia, ContentMediaEncryptedChunk, User } from '../models';
import { checkContentOwner } from '../services/content.service';
import { getFilesAndFields } from '../services/file-upload.service';
import { MEMORY_UPLOAD_SERVICE } from '../keys';
import { MemoryUploadHandler, TempFile } from '../types';
import { chunkString, generateFixedLengthRandomString } from '../services/string-util';
import { decryptContentMedia, encrypt, decryptString } from '../services/zenroom-service';
import { uploadStringToIPFS } from '../services/ipfs-service';
import { writeIntoBlockchain } from '../services/fantom-service';
import { TokenServiceBindings } from '../authorization/keys';
import { JWTService } from '../services/jwt-service';
import { ATTACHMENT_FILENAME, BASE64_ENCODING, CHUNK_MAX_CHAR_SIZE } from '../constants';

export class ContentController {
  constructor(
    @repository(ContentRepository) public contentRepository: ContentRepository,
    @repository(ContentMediaRepository) public contentMediaRepository: ContentMediaRepository,
    @repository(ContentMediaEncryptedChunksRepository) public contentMediaEncryptedChunkRepository: ContentMediaEncryptedChunksRepository,
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(SecurityBindings.USER) public user: UserProfile,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: JWTService,
    @inject(MEMORY_UPLOAD_SERVICE) private memoryUploadHandler: MemoryUploadHandler,
  ) { }

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
      content: {
        'application/json': {
          schema: getModelSchemaRef(Content, {
            title: 'NewContent',
            exclude: ['idContent'],
          })
        }
      }
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
        'application/json': { schema: getModelSchemaRef(Content, { partial: true }) }
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
        content: { 'application/json': { schema: { type: 'array', items: getModelSchemaRef(Content, { includeRelations: true }) } } }
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
  @post('/contents/{id}/upload', {
    responses: {
      200: {
        content: { 'application/json': { schema: { type: 'object' } } },
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
            const contents: string = fileUploaded.buffer.toString(BASE64_ENCODING);
            let indexId = 0;

            // Save the content
            this.saveContentMedia(id, randomString, fileUploaded).then((createdContentMedia: ContentMedia) => {
              // Generate chunk files
              const stringChunks: RegExpMatchArray | null = chunkString(contents, CHUNK_MAX_CHAR_SIZE);
              stringChunks!.forEach((element: string) => {
                const encryptedObject = encrypt(element, randomString);
                encryptedObject.indexId = indexId;
                indexId++;
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.saveContentMediaChunk(encryptedObject, createdContentMedia.idContentMedia);
              });

              resolve(createdContentMedia);
            }).catch(errDocument => console.log(errDocument));
          }
        }
      });
    });
  }

  //*** FILES LIST ***/
  @get('/contents/{id}/media', {
    responses: {
      '200': {
        description: 'Array of Content Media model instances',
        content: { 'application/json': { schema: { type: 'array', items: getModelSchemaRef(ContentMedia, { includeRelations: true }) } } }
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralContentManagement, PermissionKeys.ContentsList] })
  async findMedia(
    @param.path.string('id') id: string,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(ContentMedia)) filter?: Filter<ContentMedia>,
  ): Promise<ContentMedia[]> {
    if (currentUser.userType === 'user') {
      // Check if content is owned by the logged user
      const contentOwned = await checkContentOwner(id, currentUser.idUser, this.contentRepository);

      if (!contentOwned) {
        throw new HttpErrors.Forbidden("Content not owned");
      }
    }

    if (filter === undefined) {
      filter = {};
    }
    if (filter.where === undefined) {
      filter.where = {};
    }
    const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
    const where = queryFilters.impose({ idContent: id }).build();
    filter.where = where;
    //
    return this.contentMediaRepository.find(filter);
  }

  //*** DOWNLOAD FILE ***/
  @post('/contents/{id}/download/{idMedia}', {
    responses: {
      200: {
        content: { 'application/json': { schema: { type: 'object' } } },
        description: 'User content file download',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.ContentDetail, PermissionKeys.GeneralContentManagement] })
  async fileDownload(
    @param.path.string('id') id: string,
    @param.path.string('idMedia') idMedia: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(ContentMedia)) filter?: Filter<ContentMedia>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    if (currentUser.userType === 'user') {
      // Check if content is owned by the logged user
      const contentOwned = await checkContentOwner(id, currentUser.idUser, this.contentRepository);

      if (!contentOwned) {
        throw new HttpErrors.Forbidden("Content not owned");
      }
    }

    if (filter === undefined) {
      filter = {};
    }
    if (filter.where === undefined) {
      filter.where = {};
    }
    const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
    const where = queryFilters.impose({
      and: [{
        idContent: id,
        idContentMedia: idMedia
      }]
    }).build();
    filter.where = where;

    const contentMedia = await this.contentMediaRepository.findOne(filter)

    if (contentMedia) {
      const fileName: string = contentMedia.filename;
      let mimeType: string = '';

      if (contentMedia.mimeType) {
        mimeType = contentMedia.mimeType;
      }

      const chunksFilter: Filter = {
        where: {
          "idContentMedia": idMedia
        },
        order: ['chunkIndexId ASC']
      };
      const encryptedChunks: ContentMediaEncryptedChunk[] = await this.contentMediaEncryptedChunkRepository.find(chunksFilter);
      let textDecrypted = "";

      for await (const chunk of encryptedChunks) {
        const result = await decryptContentMedia(chunk, contentMedia.key);
        textDecrypted = textDecrypted + result.textDecrypted;
      }

      const fileContents = Buffer.from(textDecrypted, BASE64_ENCODING);
      response.writeHead(200, {
        'Content-disposition': ATTACHMENT_FILENAME + fileName,
        'Content-Type': mimeType,
        'Content-Length': fileContents.length
      });
      response.end(fileContents);
    } else {
      throw new HttpErrors.Forbidden("Content not related");
    }
  }

  //*** DOWNLOAD BASE64 FILE ***/
  @post('/contents/{id}/download-base64/{idMedia}', {
    responses: {
      200: {
        content: { 'application/json': { schema: { type: 'object' } } },
        description: 'User content file base64 download',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.ContentDetail, PermissionKeys.GeneralContentManagement] })
  async fileDownloadBase64(
    @param.path.string('id') id: string,
    @param.path.string('idMedia') idMedia: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(ContentMedia)) filter?: Filter<ContentMedia>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    if (currentUser.userType === 'user') {
      // Check if content is owned by the logged user
      const contentOwned = await checkContentOwner(id, currentUser.idUser, this.contentRepository);

      if (!contentOwned) {
        throw new HttpErrors.Forbidden("Content not owned");
      }
    }

    if (filter === undefined) {
      filter = {};
    }
    if (filter.where === undefined) {
      filter.where = {};
    }
    const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
    const where = queryFilters.impose({
      and: [{
        idContent: id,
        idContentMedia: idMedia
      }]
    }).build();
    filter.where = where;

    const contentMedia = await this.contentMediaRepository.findOne(filter)

    if (contentMedia) {
      const fileName: string = contentMedia.filename;
      let mimeType: string = '';

      if (contentMedia.mimeType) {
        mimeType = contentMedia.mimeType;
      }

      const chunksFilter: Filter = {
        where: {
          "idContentMedia": idMedia
        },
        order: ['chunkIndexId ASC']
      };
      const encryptedChunks: ContentMediaEncryptedChunk[] = await this.contentMediaEncryptedChunkRepository.find(chunksFilter);
      let textDecrypted = "";

      for await (const chunk of encryptedChunks) {
        const result = await decryptContentMedia(chunk, contentMedia.key);
        textDecrypted = textDecrypted + result.textDecrypted;
      }

      response.end(textDecrypted);
    } else {
      throw new HttpErrors.Forbidden("Content not related");
    }
  }

  //*** DELETE ***/
  @del('/contents/{id}', {
    responses: {
      '204': {
        description: 'Content DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.ContentDelete, PermissionKeys.GeneralContentManagement] })
  async deleteById(
    @param.path.string('id') id: string,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
  ): Promise<void> {
    if (currentUser.userType === 'user') {
      // Check if content is owned by the logged user
      const contentOwned = await checkContentOwner(id, currentUser.idUser, this.contentRepository);

      if (!contentOwned) {
        throw new HttpErrors.Forbidden("Content not owned");
      }
    }

    await this.contentRepository.deleteById(id);
  }

  //*** DELETE FILE ***/
  @del('/contents/{id}/delete/{idMedia}', {
    responses: {
      '204': {
        description: 'Content file DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.ContentDelete, PermissionKeys.GeneralContentManagement] })
  async deleteFileById(
    @param.path.string('id') id: string,
    @param.path.string('idMedia') idMedia: string,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile
  ): Promise<void> {
    if (currentUser.userType === 'user') {
      // Check if content is owned by the logged user
      const contentOwned = await checkContentOwner(id, currentUser.idUser, this.contentRepository);

      if (!contentOwned) {
        throw new HttpErrors.Forbidden("Content not owned");
      }

      // Check if file is related to the content
      const filterRelated: Filter = { where: { "idContent": id, "idContentMedia": idMedia } };
      const contentRelated = await this.contentMediaRepository.findOne(filterRelated);
      if (!contentRelated) {
        throw new HttpErrors.Forbidden("Content not related");
      }
    }

    await this.contentMediaRepository.deleteById(idMedia);
  }

  private async saveContentMedia(idContent: string, key: string, fileUploaded: TempFile): Promise<ContentMedia> {
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
  private async saveContentMediaChunk(objectToSave: any, contentMediaUUIDReference: string): Promise<ContentMediaEncryptedChunk> {
    const contentMediaEncryptedChunk: ContentMediaEncryptedChunk = new ContentMediaEncryptedChunk();
    contentMediaEncryptedChunk.header = objectToSave.secret_message.header;
    contentMediaEncryptedChunk.text = objectToSave.secret_message.text;
    contentMediaEncryptedChunk.checksum = objectToSave.secret_message.checksum;
    contentMediaEncryptedChunk.iv = objectToSave.secret_message.iv;
    contentMediaEncryptedChunk.idContentMedia = contentMediaUUIDReference;
    contentMediaEncryptedChunk.chunkIndexId = objectToSave.indexId;
    contentMediaEncryptedChunk.ipfsPath = await uploadStringToIPFS(contentMediaEncryptedChunk.text!);

    let jsonToSave = {
      "header": contentMediaEncryptedChunk.header,
      "checksum": contentMediaEncryptedChunk.checksum,
      "iv": contentMediaEncryptedChunk.iv,
      "ipfsPath": contentMediaEncryptedChunk.ipfsPath
    }

    contentMediaEncryptedChunk.transactionId = await writeIntoBlockchain(jsonToSave);
    if (contentMediaEncryptedChunk.transactionId) {
      contentMediaEncryptedChunk.status = 'PENDING';
    }

    return this.contentMediaEncryptedChunkRepository.save(contentMediaEncryptedChunk);
  }
}
