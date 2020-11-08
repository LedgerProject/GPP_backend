//Loopback imports
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { Filter, repository } from '@loopback/repository';
import { del, get, getFilterSchemaFor, getModelSchemaRef, param, patch, post, Request, requestBody, Response, RestBindings, HttpErrors } from '@loopback/rest';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { Icon } from '../models';
import { IconRepository } from '../repositories';
import { FILE_UPLOAD_SERVICE } from '../keys';
import { getFilesAndFields } from '../services/file-upload.service';
import { FileUploadHandler } from '../types';

const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const imageToBase64 = require('image-to-base64');

// Set the path to the sandbox folder
const sandboxPath = path.join(__dirname, '..', '..', '.sandbox');

export class IconController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE)
    private fileUploadHandler: FileUploadHandler,
    @repository(IconRepository)
    public iconRepository: IconRepository,
  ) { }

  //*** LIST ***/
  @get('/icons', {
    responses: {
      '200': {
        description: 'Array of Icon model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Icon, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.OrganizationStructuresManagement, PermissionKeys.GeneralIconsManagement] })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Icon)) filter?: Filter<Icon>,
  ): Promise<Icon[]> {
    return this.iconRepository.find(filter);
  }

  //*** INSERT ***/
  @post('/icons/{name}', {
    responses: {
      '200': {
        description: 'Icon model instance',
        content: { 'application/json': { schema: { type: 'object' } } },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralIconsManagement] })
  async create(
    @param.path.string('name') name: string,
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Icon> {
    // Check if the name is already assigned
    const filter: Filter = { where: { name : name }};
    const nameExists = await this.iconRepository.findOne(filter);

    if (nameExists !== null) {
      throw new HttpErrors.Conflict("The name specified is already assigned, please change it");
    }

    // File upload
    const promiseIcon = new Promise<Icon>((resolve, reject) => {
      this.fileUploadHandler(request, response, (err) => {
        if (err) {
          // Multer error
          resolve(err);
        } else {
          // Get all the file informations
          const filesAndFields = getFilesAndFields(request);
          
          if (filesAndFields.files.length > 1) {
            // Get the first file informations
            const fileUploaded1 = filesAndFields.files[0];
            const fileUploaded2 = filesAndFields.files[1];

            // Check if the file1 is jpeg or png
            if (fileUploaded1.mimetype !== "image/jpeg" && fileUploaded1.mimetype !== "image/png") {
              fs.unlinkSync(sandboxPath + "/" + fileUploaded1.tempfilename); // Remove the temporary file
              fs.unlinkSync(sandboxPath + "/" + fileUploaded2.tempfilename); // Remove the temporary file
              reject(new HttpErrors.BadRequest('Please select an image/jpeg or image/png file'));
              return;
            }

            // Check if the file2 is jpeg or png
            if (fileUploaded2.mimetype !== "image/jpeg" && fileUploaded2.mimetype !== "image/png") {
              fs.unlinkSync(sandboxPath + "/" + fileUploaded1.tempfilename); // Remove the temporary file
              fs.unlinkSync(sandboxPath + "/" + fileUploaded2.tempfilename); // Remove the temporary file
              reject(new HttpErrors.BadRequest('Please select an image/jpeg or image/png file'));
              return;
            }

            // Check the eight and width of image 1
            const dimensions1 = sizeOf(sandboxPath + "/" + fileUploaded1.tempfilename);
            const iconWidth = parseInt(process.env.ICON_WIDTH + "");
            const iconHeight = parseInt(process.env.ICON_HEIGHT + "");
            if (dimensions1.width !== iconWidth || dimensions1.height !== iconHeight) {
              fs.unlinkSync(sandboxPath + "/" + fileUploaded1.tempfilename); // Remove the temporary file
              fs.unlinkSync(sandboxPath + "/" + fileUploaded2.tempfilename); // Remove the temporary file
              reject(new HttpErrors.BadRequest('Please select an image ' + process.env.ICON_WIDTH + 'x' + process.env.ICON_HEIGHT + ' pixels'));
              return;
            }

            // Check the eight and width of image 2
            const dimensions2 = sizeOf(sandboxPath + "/" + fileUploaded2.tempfilename);
            const markerWidth = parseInt(process.env.MARKER_WIDTH + "");
            const markerHeight = parseInt(process.env.MARKER_HEIGHT + "");
            if (dimensions2.width !== markerWidth || dimensions2.height !== markerHeight) {
              fs.unlinkSync(sandboxPath + "/" + fileUploaded1.tempfilename); // Remove the temporary file
              fs.unlinkSync(sandboxPath + "/" + fileUploaded2.tempfilename); // Remove the temporary file
              reject(new HttpErrors.BadRequest('Please select a marker image ' + process.env.MARKER_WIDTH + 'x' + process.env.MARKER_HEIGHT + ' pixels'));
              return;
            }

            imageToBase64(sandboxPath + "/" + fileUploaded1.tempfilename)
              .then( async (responseBase64: string) => {
                imageToBase64(sandboxPath + "/" + fileUploaded2.tempfilename)
                  .then( async (responseMarkerBase64: string) => {
                    const icon:Icon = new Icon();
                    icon.name = name;
                    icon.image = responseBase64;
                    icon.marker = responseMarkerBase64;
                    const newIcon = await this.iconRepository.create(icon);
    
                    resolve(newIcon);
                  })
                  .catch((errorMarkerBase64: object) => {
                    reject(new HttpErrors.BadRequest('Error converting image marker to base64 ' + errorMarkerBase64));
                    return;
                  })
              })
              .catch((errorBase64: object) => {
                reject(new HttpErrors.BadRequest('Error converting image to base64 ' + errorBase64));
                return;
              })
          }
        }
      });
    });
    
    return promiseIcon;
  }

  //*** DETAILS ***/
  @get('/icons/{id}', {
    responses: {
      '200': {
        description: 'Icon model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Icon, { includeRelations: true }),
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralIconsManagement] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Icon)) filter?: Filter<Icon>
  ): Promise<Icon> {
    return this.iconRepository.findById(id, filter);
  }

  //*** UPDATE ***/
  @patch('/icons/{id}', {
    responses: {
      '204': {
        description: 'Icon PATCH success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralIconsManagement] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Icon, { partial: true }),
        },
      },
    })
    icon: Icon,
  ): Promise<void> {
    // Check if the alias is already assigned
    const filter: Filter = { where: { idIcon : { nlike: id },  name : icon.name }};
    const nameExists = await this.iconRepository.findOne(filter);

    if (nameExists !== null) {
      throw new HttpErrors.Conflict("The name specified is already assigned, please change it");
    }

    await this.iconRepository.updateById(id, icon);
  }

  //*** DELETE ***/
  @del('/icons/{id}', {
    responses: {
      '204': {
        description: 'Icon DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralIconsManagement] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.iconRepository.deleteById(id);
  }
}
