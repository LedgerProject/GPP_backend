// Loopback imports
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { AnyObject, Filter, repository, WhereBuilder } from '@loopback/repository';
import { post, param, Request, Response, get, getFilterSchemaFor, getModelSchemaRef, del, requestBody, RestBindings, HttpErrors } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
// GPP imports
import { DocumentRepository, DocumentEncryptedChunksRepository, UserTokenRepository } from '../repositories';
import { PermissionKeys } from '../authorization/permission-keys';
import { DocumentEncryptedChunk, UserToken} from '../models';
import { Document } from '../models'
import { getFilesAndFields } from '../services/file-upload.service';
import { MEMORY_UPLOAD_SERVICE } from '../keys';
import { MemoryUploadHandler, TempFile } from '../types';
import { chunkString } from '../services/string-util';
import { decrypt, encrypt } from '../services/zenroom-service';
import { uploadStringToIPFS, retrieveStringFromIPFS } from '../services/ipfs-service';
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
  
  //*** UPLOAD DOCUMENT ***/
  @post('/documents/{title}', {
    responses: {
      200: {
        content: {'application/json': {schema: {type: 'object'}}},
        description: 'User document upload',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.DocWalletManagement] })
  async fileUpload(
    @param.path.string('title') title: string,
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
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
            this.saveDocument(currentUser.idUser, title, fileUploaded).then((createdDocument:Document) => {
              // Generate chunk files
              const stringChunks : RegExpMatchArray | null = chunkString(contents, CHUNK_MAX_CHAR_SIZE);    
              stringChunks!.forEach((element: string) => {
                const encryptedObject = encrypt(element, currentUser.idUser);     
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
  ): Promise<Document[]> {
    const userTokenFilter: Filter = { where: { "token": token } };
    const foundTokenList = await this.userTokenRepository.find(userTokenFilter);
    const userToken: UserToken = this.checkAndExtractUserToken(foundTokenList);
    return this.documentRepository.find({ where: { "idUser": userToken.idUser }});
  }

  //*** DOWNLOAD FILE BY TOKEN ***/
  @get('/documents/{id}/operator/{token}')
  @authenticate('jwt', { required: [PermissionKeys.CheckTokenDocWallet] })
  async downloadOperator(
    @param.path.string('token') token: string,
    @param.path.string('id') id: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.object('filter', getFilterSchemaFor(Document)) filter?: Filter<Document>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const userTokenFilter: Filter = { where: { "token": token } };
    const foundTokenList = await this.userTokenRepository.find(userTokenFilter);

    const userToken: UserToken = this.checkAndExtractUserToken(foundTokenList);
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

    encryptedChunks.forEach((chunk: DocumentEncryptedChunk) => {
      const result = decrypt(chunk, userToken.idUser);
      textDecrypted = textDecrypted + result.textDecrypted;
    }); 
 
    const fileContents = Buffer.from(textDecrypted, BASE64_ENCODING);
    response.writeHead(200, {
      'Content-disposition': ATTACHMENT_FILENAME + fileName,
      'Content-Type': contentType,
      'Content-Length': fileContents.length
    });
    response.end(fileContents);
  }

  //*** DOWNLOAD ***/
  @get('/documents/{id}')
  @authenticate('jwt', { required: [PermissionKeys.DocWalletManagement] })
  async download(
    @param.path.string('id') id: string,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
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
    const where = queryFilters.impose({ idDocument: id, idUser: currentUser.idUser }).build();
    filter.where = where;

    const documents = await this.documentRepository.find(filter);
    if(documents.length !== 1){
      throw new HttpErrors.NotFound("No documents found for that id and idUser");
    }
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

    encryptedChunks.forEach((chunk: DocumentEncryptedChunk) => {
      const result = decrypt(chunk, currentUser.idUser);
      textDecrypted = textDecrypted + result.textDecrypted;
    }); 
 
    const fileContents = Buffer.from(textDecrypted, BASE64_ENCODING);
    response.writeHead(200, {
      'Content-disposition': ATTACHMENT_FILENAME + fileName,
      'Content-Type': contentType,
      'Content-Length': fileContents.length
    });
    response.end(fileContents);
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
    return this.documentEncryptedChunkRepository.save(documentsEncryptedChunk);
  }

  private checkAndExtractUserToken(foundTokenList: UserToken[]) {
    const currentDate = new Date();
    if (foundTokenList.length !== 1) {
      throw new HttpErrors.NotFound("Invalid token");
    }

    const userToken: UserToken = foundTokenList[0];
    if (!userToken.validUntil) {
      throw new HttpErrors.NotFound("Invalid token");
    }

    const validUntilDate = new Date(userToken.validUntil);

    if (currentDate > validUntilDate) {
      throw new HttpErrors.NotFound("Token is expired");
    }
    return userToken;
  }
}
