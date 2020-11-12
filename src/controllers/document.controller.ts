// Loopback imports
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { Count, CountSchema, Filter, repository, Where } from '@loopback/repository';
import { post, param, Request, Response, get, getFilterSchemaFor, getModelSchemaRef, getWhereSchemaFor, patch, put, del, requestBody, RestBindings } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
// GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { Document } from '../models';
import { DocumentRepository } from '../repositories';
import { getFilesAndFields } from '../services/file-upload.service';
import { FILE_UPLOAD_SERVICE } from '../keys';
import { FileUploadHandler } from '../types';

export class DocumentController {
  constructor(
    @repository(DocumentRepository)
    public documentRepository : DocumentRepository,
    @inject(FILE_UPLOAD_SERVICE)
    private fileUploadHandler: FileUploadHandler,
    @inject(SecurityBindings.USER)
    public user: UserProfile
  ) {}

  @post('/documents', {
    responses: {
      200: {
        description: 'Document file',
        content: {'application/json': {schema: getModelSchemaRef(Document)}},
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.DocWalletManagement] })
  async fileUpload(
    @param.path.string('title') title: string,
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Document> {
    // File upload
    const promiseFiles = new Promise<Document>((resolve, reject) => {
      this.fileUploadHandler(request, response, (err) => {
        if (err) {
          // Multer error
          resolve(err);
        } else {
          // Get all the file informations
          const filesAndFields = getFilesAndFields(request);

          if (filesAndFields.files.length > 0) {
            // Get the first file informations
            const fileUploaded = filesAndFields.files[0];

            // Save the information in the document object
            const newDocument:Document = new Document();
            newDocument.idUser = this.user.idUser;
            newDocument.title = title;
            newDocument.filename = fileUploaded.originalname;
            newDocument.mimeType = fileUploaded.mimetype;
            newDocument.size = fileUploaded.size;

            // Check, if the file is jpeg, compress it
            /*switch (fileUploaded.mimetype) {
              case "image/jpeg":
                // Check the eight and width of image 1
                const dimensions = sizeOf(sandboxPath + '/' + fileUploaded.tempfilename);
                newDocument.widthPixel = dimensions.width;
                newDocument.heightPixel = dimensions.height;

                const newDocumentImageCreated = await currDocumentRepository.create(newDocument);
                resolve(newDocumentImageCreated);
              break;

              default:
                
              break;
            }*/

            resolve(this.documentRepository.create(newDocument));
          }
        }
      });
    });

    return promiseFiles;
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

  @patch('/documents', {
    responses: {
      '200': {
        description: 'Document PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Document, {partial: true}),
        },
      },
    })
    document: Document,
    @param.query.object('where', getWhereSchemaFor(Document)) where?: Where<Document>,
  ): Promise<Count> {
    return this.documentRepository.updateAll(document, where);
  }

  @get('/documents/{id}', {
    responses: {
      '200': {
        description: 'Document model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Document, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Document)) filter?: Filter<Document>
  ): Promise<Document> {
    return this.documentRepository.findById(id, filter);
  }

  @patch('/documents/{id}', {
    responses: {
      '204': {
        description: 'Document PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Document, {partial: true}),
        },
      },
    })
    document: Document,
  ): Promise<void> {
    await this.documentRepository.updateById(id, document);
  }

  @put('/documents/{id}', {
    responses: {
      '204': {
        description: 'Document PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() document: Document,
  ): Promise<void> {
    await this.documentRepository.replaceById(id, document);
  }

  @del('/documents/{id}', {
    responses: {
      '204': {
        description: 'Document DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.documentRepository.deleteById(id);
  }
}
