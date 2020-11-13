// Loopback imports
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { Count, CountSchema, Filter, repository, Where } from '@loopback/repository';
import { post, param, Request, Response, get, getFilterSchemaFor, getModelSchemaRef, getWhereSchemaFor, del, requestBody, RestBindings } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
// GPP imports
import { DocumentRepository, DocumentEncryptedChunksRepository } from '../repositories';
import { PermissionKeys } from '../authorization/permission-keys';
import { Document, DocumentEncryptedChunk} from '../models';
import { getFilesAndFields } from '../services/memory-upload.service';
import { MEMORY_UPLOAD_SERVICE } from '../keys';
import { MemoryUploadHandler } from '../types';
import { chunkString } from '../services/string-splitter';
import { decrypt, encrypt } from '../services/zenroom-service';
import { TokenServiceBindings } from '../authorization/keys';
import { JWTService } from '../services/jwt-service';
import { BASE64_ENCODING, CHUNK_MAX_CHAR_SIZE } from '../constants';
import { v4 as uuid } from 'uuid';

export class DocumentController {
  constructor(
    @repository(DocumentRepository)
    public documentRepository : DocumentRepository,
    @repository(DocumentEncryptedChunksRepository)
    public documentEncryptedChunkRepository : DocumentEncryptedChunksRepository,
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
    @param.path.string('title') title: string,
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.memoryUploadHandler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          const files = getFilesAndFields(request);
          const fileUploaded = files[0];

          const contents : string = fileUploaded.buffer.toString(BASE64_ENCODING);
          const fileUUID = uuid();
          let indexId : number = 0;
          
          const newDocument : Document = new Document();
          newDocument.idUser = currentUser.idUser;
          newDocument.title = title;
          newDocument.filename = fileUploaded.originalname;
          newDocument.mimeType = fileUploaded.mimetype;
          newDocument.size = fileUploaded.size;
          newDocument.mimeType = fileUploaded.mimetype;
          newDocument.idDocument = fileUUID;
          this.documentRepository.save(newDocument);

          const stringChunks : any = chunkString(contents, CHUNK_MAX_CHAR_SIZE);    
          stringChunks.forEach((element: any) => {
            const chunkUUID = uuid();
            const objectToSave = encrypt(element, currentUser.idUser);     
            objectToSave.indexId = indexId;
            indexId++;

            let documentsEncryptedChunk: DocumentEncryptedChunk = new DocumentEncryptedChunk();
            documentsEncryptedChunk.idDocumentEncryptedChunk = chunkUUID;
            documentsEncryptedChunk.idUser = currentUser.idUser;
            documentsEncryptedChunk.header = objectToSave.secret_message.header;
            documentsEncryptedChunk.text = objectToSave.secret_message.text;
            documentsEncryptedChunk.checksum = objectToSave.secret_message.checksum;
            documentsEncryptedChunk.iv = objectToSave.secret_message.iv;
            documentsEncryptedChunk.idDocument = fileUUID;
            documentsEncryptedChunk.chunkIndexId = objectToSave.indexId;
            this.documentEncryptedChunkRepository.save(documentsEncryptedChunk);
          });
        }
      });
    });
  }

  @get('/documents/count', {
    responses: {
      '200': {
        description: 'Document model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Document)) where?: Where<Document>,
  ): Promise<Count> {
    return this.documentRepository.count(where);
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
  async find(
    @param.query.object('filter', getFilterSchemaFor(Document)) filter?: Filter<Document>,
  ): Promise<Document[]> {
    return this.documentRepository.find(filter);
  }

  @get('/documents/{id}')
  @authenticate('jwt', { required: [PermissionKeys.AuthFeatures] })
  async download(
    @param.path.string('id') id: string,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
 
    let documents = await this.documentEncryptedChunkRepository.find({ where: { "idDocument": id }});
    let document = documents[0];

    let fileName : string = document.filename;
    let contentType : string = document.mimeType;

    const filter: Filter = { where: { 
        "idDocument": id,
        "idUser": currentUser.idUser
      },
      order: ['chunkIndexId ASC']
    };
    let encryptedChunks : DocumentEncryptedChunk[] = await this.documentEncryptedChunkRepository.find(filter);
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
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.documentEncryptedChunkRepository.deleteAll({ where: { "idDocument": id }});
    await this.documentRepository.deleteById(id);
  }
}
