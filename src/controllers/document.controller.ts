// Loopback imports
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { AnyObject, Count, CountSchema, Filter, repository, Where, WhereBuilder } from '@loopback/repository';
import { post, param, Request, Response, get, getFilterSchemaFor, getModelSchemaRef, getWhereSchemaFor, del, requestBody, RestBindings, HttpErrors } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
// GPP imports
import { DocumentRepository, DocumentEncryptedChunksRepository, UserTokenRepository } from '../repositories';
import { PermissionKeys } from '../authorization/permission-keys';
import { DocumentEncryptedChunk, UserToken} from '../models';
import { Document } from '../models'
import { getFilesAndFields } from '../services/memory-upload.service';
import { MEMORY_UPLOAD_SERVICE } from '../keys';
import { MemoryUploadHandler } from '../types';
import { chunkString } from '../services/string-util';
import { decrypt, encrypt } from '../services/zenroom-service';
import { TokenServiceBindings } from '../authorization/keys';
import { JWTService } from '../services/jwt-service';
import { ATTACHMENT_FILENAME, BASE64_ENCODING, CHUNK_MAX_CHAR_SIZE } from '../constants';

export class DocumentController {
  constructor(
    @repository(DocumentRepository)
    public documentRepository : DocumentRepository,
    @repository(DocumentEncryptedChunksRepository)
    public documentEncryptedChunkRepository : DocumentEncryptedChunksRepository,
    @repository(UserTokenRepository)
    public userTokenRepository : UserTokenRepository,
    @inject(SecurityBindings.USER)
    public user: UserProfile,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject(MEMORY_UPLOAD_SERVICE) private memoryUploadHandler: MemoryUploadHandler,
  ) {}

  @post('/documents', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.AuthFeatures] })
  async fileUpload(
    @param.header.string('title') title: string,
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.memoryUploadHandler(request, response, (err) => {
        if (err) resolve(err);
        else {
          const filesAndFields = getFilesAndFields(request);
          const fileUploaded = filesAndFields.files[0];

          const contents : string = fileUploaded.buffer.toString(BASE64_ENCODING);
          let indexId : number = 0;
          
          this.saveDocument(currentUser.idUser, title, fileUploaded).then((createdDocument:any) => {
            const stringChunks : any = chunkString(contents, CHUNK_MAX_CHAR_SIZE);    
            stringChunks.forEach((element: any) => {
              
              const encryptedObject = encrypt(element, currentUser.idUser);     
              encryptedObject.indexId = indexId;
              indexId++;
  
              this.saveDocumentChunk(encryptedObject, createdDocument.idDocument);
            }); 
            resolve(createdDocument);
          });
          
        }
      });
    });
  }

  private async saveDocumentChunk(objectToSave: any, documentUUIDReference: string) : Promise<any> {
    let documentsEncryptedChunk: DocumentEncryptedChunk = new DocumentEncryptedChunk();
    documentsEncryptedChunk.header = objectToSave.secret_message.header;
    documentsEncryptedChunk.text = objectToSave.secret_message.text;
    documentsEncryptedChunk.checksum = objectToSave.secret_message.checksum;
    documentsEncryptedChunk.iv = objectToSave.secret_message.iv;
    documentsEncryptedChunk.idDocument = documentUUIDReference;
    documentsEncryptedChunk.chunkIndexId = objectToSave.indexId;
    return await this.documentEncryptedChunkRepository.save(documentsEncryptedChunk);
  }

  private async saveDocument(idUser: string, title: string, fileUploaded: any) : Promise<any>{
    const newDocument: Document = new Document();
    newDocument.idUser = idUser;
    newDocument.title = title;
    newDocument.filename = fileUploaded.originalname;
    newDocument.mimeType = fileUploaded.mimetype;
    newDocument.size = fileUploaded.size;
    newDocument.mimeType = fileUploaded.mimetype;
    return await this.documentRepository.save(newDocument);
  }

  @get('/documents', {
    responses: {
      '200': {
        description: 'Array of Document model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Document, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.AuthFeatures] })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
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

  @get('/documents/operator/{token}', {
    responses: {
      '200': {
        description: 'Array of Document model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Document, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.CheckTokenDocWallet] })
  async findByToken(    
    @param.path.string('token') token: string,
  ): Promise<Document[]> {
    const userTokenFilter: Filter = { where: { "token": token } };
    const foundTokenList = await this.userTokenRepository.find(userTokenFilter);
    let userToken: UserToken = this.checkAndExtractUserToken(foundTokenList);
    return this.documentRepository.find({ where: { "idUser": userToken.idUser }});
  }

  @get('/documents/operator')
  @authenticate('jwt', { required: [PermissionKeys.CheckTokenDocWallet] })
  async downloadOperator(
    @param.header.string('token') token: string,
    @param.header.string('id') id: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.object('filter', getFilterSchemaFor(Document)) filter?: Filter<Document>,
  ): Promise<any> {

    const userTokenFilter: Filter = { where: { "token": token } };
    const foundTokenList = await this.userTokenRepository.find(userTokenFilter);

    let userToken: UserToken = this.checkAndExtractUserToken(foundTokenList);
    if (filter === undefined) {
      filter = {};
    }
    if (filter.where === undefined) {
      filter.where = {};
    }
    const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
    const where = queryFilters.impose({ idDocument: id, idUser: userToken.idUser }).build();
    filter.where = where;

    let documents = await this.documentRepository.find(filter);
    if(documents.length != 1){
      throw new HttpErrors.NotFound("No documents found for that id and idUser");
    }
    let document = documents[0];

    let fileName : string = document.filename;
    let contentType : string = document.mimeType;

    const chunksFilter: Filter = { 
      where: { "idDocument": id },
      order: ['chunkIndexId ASC']
    };
    let encryptedChunks : DocumentEncryptedChunk[] = await this.documentEncryptedChunkRepository.find(chunksFilter);
    let textDecrypted : string = "";

    encryptedChunks.forEach((chunk: any) => {
      const result = decrypt(chunk, userToken.idUser);
      textDecrypted = textDecrypted + result.textDecrypted;
    }); 
 
    var fileContents = Buffer.from(textDecrypted, BASE64_ENCODING);
    response.writeHead(200, {
      'Content-disposition': ATTACHMENT_FILENAME + fileName,
      'Content-Type': contentType,
      'Content-Length': fileContents.length
    });
    response.end(fileContents);
  }

  private checkAndExtractUserToken(foundTokenList: UserToken[]) {
    let currentDate = new Date();
    if (foundTokenList.length != 1) {
      throw new HttpErrors.NotFound("Invalid token");
    }

    let userToken: UserToken = foundTokenList[0];
    if (!userToken.validUntil) {
      throw new HttpErrors.NotFound("Invalid token");
    }

    let validUntilDate = new Date(userToken.validUntil);

    if (currentDate > validUntilDate) {
      throw new HttpErrors.NotFound("Token is expired");
    }
    return userToken;
  }

  @get('/documents/{id}')
  @authenticate('jwt', { required: [PermissionKeys.AuthFeatures] })
  async download(
    @param.path.string('id') id: string,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.object('filter', getFilterSchemaFor(Document)) filter?: Filter<Document>,
  ): Promise<any> {
    if (filter === undefined) {
      filter = {};
    }
    if (filter.where === undefined) {
      filter.where = {};
    }
    const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
    const where = queryFilters.impose({ idDocument: id, idUser: currentUser.idUser }).build();
    filter.where = where;

    let documents = await this.documentRepository.find(filter);
    if(documents.length != 1){
      throw new HttpErrors.NotFound("No documents found for that id and idUser");
    }
    let document = documents[0];

    let fileName : string = document.filename;
    let contentType : string = document.mimeType;

    const chunksFilter: Filter = { where: { 
        "idDocument": id
      },
      order: ['chunkIndexId ASC']
    };
    let encryptedChunks : DocumentEncryptedChunk[] = await this.documentEncryptedChunkRepository.find(chunksFilter);
    let textDecrypted : string = "";

    encryptedChunks.forEach((chunk: any) => {
      const result = decrypt(chunk, currentUser.idUser);
      textDecrypted = textDecrypted + result.textDecrypted;
    }); 
 
    var fileContents = Buffer.from(textDecrypted, BASE64_ENCODING);
    response.writeHead(200, {
      'Content-disposition': 'attachment; filename=' + fileName,
      'Content-Type': contentType,
      'Content-Length': fileContents.length
    });
    response.end(fileContents);
  }

  @del('/documents/{id}', {
    responses: {
      '204': {
        description: 'Document DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.AuthFeatures] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.documentEncryptedChunkRepository.deleteAll({ where: { "idDocument": id }});
    await this.documentRepository.deleteById(id);
  }
}
