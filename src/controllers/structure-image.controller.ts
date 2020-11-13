// Loopback imports
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { Filter, repository } from '@loopback/repository';
import { post, param, Request, del, requestBody, Response, RestBindings, HttpErrors } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
// Other imports
import { v4 as uuid } from 'uuid'
// GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { StructureImage } from '../models';
import { StructureImageRepository, StructureRepository } from '../repositories';
import { checkStructureOwner } from '../services/structure.service';
import { getFilesAndFields } from '../services/file-upload.service';
import { FILE_UPLOAD_SERVICE } from '../keys';
import { FileUploadHandler, CompressImageStatistic } from '../types';

const compressImages = require("compress-images");
const fs = require('fs');
const path = require('path');

// Set the path to the sandbox folder
const sandboxPath = path.join(__dirname, '..', '..', '.sandbox');

// Set the path to the structures folder
const galleriesStructuresPath = path.join(__dirname, '..', '..', 'public', 'galleries', 'structures');

export class StructureImageController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE)
    private fileUploadHandler: FileUploadHandler,
    @repository(StructureImageRepository)
    public structureImageRepository : StructureImageRepository,
    @repository(StructureRepository)
    public structureRepository : StructureRepository,
    @inject(SecurityBindings.USER)
    public user: UserProfile
  ) {}

  //*** INSERT (UPLOAD) ***/
  @post('/structures-images/{idStructure}', {
    responses: {
      200: {
        content: { 'application/json': { schema: { type: 'object' } } },
        description: 'StructureImage file',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureCreation, PermissionKeys.GeneralStructuresManagement] })
  async fileUpload(
    @param.path.string('idStructure') idStructure: string,
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<StructureImage> {
    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(idStructure, this.user.idOrganization, this.structureRepository);
    }

    // Get the last sorting number and the structure images folder
    const filterInfoImageStructure: Filter = { where: { "idStructure": idStructure }, order: ["sorting DESC"] };
    const imageDetail = await this.structureImageRepository.findOne(filterInfoImageStructure);
    let sortingNumber = 0;
    let folder = "";

    // Apply the sort number
    if (imageDetail !== null) {
      sortingNumber = imageDetail.sorting + 1;
      folder = imageDetail.folder;
    } else {
      sortingNumber = 1;
    }

    // File upload
    const promiseFiles = new Promise<StructureImage>((resolve, reject) => {
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

            // Check if the file is jpeg
            if (fileUploaded.mimetype !== "image/jpeg") {
              fs.unlinkSync(sandboxPath + "/" + fileUploaded.tempfilename); // Remove the temporary file
              reject(new HttpErrors.BadRequest('Please select an image/jpeg file'));
              return;
            }

            // Set/Generate the destination folder
            const destFolder = folder === "" ? uuid() : folder;

            // Set the destination path
            const destPath = galleriesStructuresPath + '/' + destFolder;

            // Check if image exists
            if (fs.existsSync(destPath + "/" + fileUploaded.originalname)) {
              fs.unlinkSync(sandboxPath + "/" + fileUploaded.tempfilename); // Remove the temporary file
              reject(new HttpErrors.Conflict('File with this name already exists, please select another one file or rename it'));
              return;
            }

            // Create the destination path if not exists
            if (!fs.existsSync(destPath)) {
              fs.mkdirSync(destPath);
            }
            
            // Copy the file from sandbox folder to the destination folder
            fs.copyFileSync(sandboxPath + "/" + fileUploaded.tempfilename, destPath + "/" + fileUploaded.originalname, (errCopy: unknown) => {
              if (errCopy) {
                reject(new HttpErrors.InternalServerError('Upload error, contact the system administrator: ' + errCopy));
                return;
              }
            });

            // Remove temporary file
            fs.unlinkSync(sandboxPath + "/" + fileUploaded.tempfilename);

            // Set in a constant StructureImageRepository
            const currStructureImageRepository:StructureImageRepository = this.structureImageRepository;

            // Compress the image
            compressImages(destPath + '/' + filesAndFields.files[0].originalname, destPath + 'compressed-', 
                // eslint-disable-next-line @typescript-eslint/camelcase
                { compress_force: false, statistic: true, autoupdate: true }, false,
                { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                { png: { engine: false, command: false } },
                { svg: { engine: false, command: false } },
                { gif: { engine: false, command: false } },
                async function (error: object, completed: boolean, statistic: CompressImageStatistic) {
                  if (error) {
                    reject(new HttpErrors.InternalServerError('Compression error, contact the system administrator: ' + error));
                    return;
                  } else if (completed) {
                    // Delete the uncompressed image and rename the compressed image
                    if (fs.existsSync(statistic.path_out_new) && fs.existsSync(statistic.input)) {
                      fs.unlinkSync(statistic.input);
                      fs.renameSync(statistic.path_out_new, statistic.input);

                      // Save the information in the database
                      const structureImage:StructureImage = new StructureImage();
                      structureImage.idStructure = idStructure;
                      structureImage.folder = destFolder;
                      structureImage.filename = filesAndFields.files[0].originalname;
                      structureImage.mimeType = filesAndFields.files[0].mimetype;
                      structureImage.size = statistic.size_output;
                      structureImage.sorting = sortingNumber;
                      const newStructureImage = await currStructureImageRepository.create(structureImage);

                      resolve(newStructureImage); 
                    } else {
                      reject(new HttpErrors.InternalServerError('Compression error, contact the system administrator'));
                      return;
                    }
                  }
                }
            );
          }
        }
      });
    });
    
    return promiseFiles;
  }

  //*** DELETE ***/
  @del('/structures-images/{id}', {
    responses: {
      '204': {
        description: 'StructureImage DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureDelete, PermissionKeys.GeneralStructuresManagement] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const filterImg: Filter = { where: { "idStructureImage": id } };
    const imageDetail = await this.structureImageRepository.findOne(filterImg);

    if (imageDetail !== null) {
      // If operator, check if it is an owned structure
      if (this.user.userType !== 'gppOperator') {
        await checkStructureOwner(imageDetail!.idStructure, this.user.idOrganization, this.structureRepository);
      }

      // Set the destination path
      const destPath = galleriesStructuresPath + '/' + imageDetail.folder;

      // Check, if the file exists, it will be deleted
      if (fs.existsSync(destPath + "/" + imageDetail.filename)) {
        fs.unlinkSync(destPath + "/" + imageDetail.filename); // Remove the file
      }

      // Check, if there aren't files in the folder, it will be deleted
      const filesInDir = fs.readdirSync(destPath); 
      if (filesInDir.length === 0) {
        fs.rmdirSync(destPath); // Remove the folder
      }
      
      await this.structureImageRepository.deleteById(id);

      // Recalculate the structure images sorting
      const filterSorting: Filter = { where: { "idStructure": imageDetail!.idStructure }, order: ["sorting ASC"] };
      const images: StructureImage[] = await this.structureImageRepository.find(filterSorting);

      let newSort = 0;
      for (const image of images) {
        newSort++;
        image.sorting = newSort;
        await this.structureImageRepository.updateById(image.idStructureImage, image);
      }
    }
  }
}
