//Loopback imports
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { AnyObject, Filter, repository, WhereBuilder } from '@loopback/repository';
import { del, get, getFilterSchemaFor, getModelSchemaRef, HttpErrors, param, patch, post, requestBody, Request, Response, RestBindings } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { Structure, StructuresCategoriesView, StructureLanguage, StructuresView, StructureImage } from '../models';
import { StructureRepository, StructuresCategoriesViewRepository, StructureLanguageRepository, StructuresViewRepository, StructureImageRepository, IconRepository, OrganizationUserRepository, UserRepository } from '../repositories';
import { checkStructureOwner } from '../services/structure.service';
import { slugify } from '../services/string-util';
import { getFilesAndFields } from '../services/file-upload.service';
import { ImporterFactory } from 'xlsx-import/lib/ImporterFactory';
import { FileUploadHandler } from '../types';
import { FILE_UPLOAD_SERVICE } from '../keys';

const exportToExcel = require('export-to-excel');
const loopback = require('loopback');
const fs = require('fs');
const path = require('path');

// Set the path to the sandbox folder
const sandboxPath = path.join(__dirname, '..', '..', '.sandbox');

interface StructureMessage {
  structureMessage: string;
}

interface PublicationOperation {
  publicationStatus: string;
  rejectionMessage: string;
}

interface OperationOutcome {
  code: string;
  message: string;
}

interface ExcelExportOutcome {
  code: string;
  message: string;
  filename: string;
}

interface ExcelStructureRow {
  alias: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  email: string | undefined;
  phoneNumberPrefix: string | undefined;
  phoneNumber: string | undefined;
  website: string | undefined;
  icon: string | undefined;
  descriptionEng: string | undefined;
  descriptionFra: string | undefined;
}

// tslint:disable:object-literal-sort-keys
const excelConfig = () => ({
  items: {
      worksheet: 'Foglio1',
      type: 'list',
      rowOffset: 1,
      columns: [
          { index: 1, key: 'alias' },
          { index: 2, key: 'name' },
          { index: 3, key: 'address' },
          { index: 4, key: 'city' },
          { index: 5, key: 'latitude', mapper: (v: string) => Number(v) },
          { index: 6, key: 'longitude', mapper: (v: string) => Number(v) },
          { index: 7, key: 'email' },
          { index: 8, key: 'phoneNumberPrefix' },
          { index: 9, key: 'phoneNumber' },
          { index: 10, key: 'website' },
          { index: 11, key: 'icon' },
          { index: 12, key: 'descriptionEng' },
          { index: 13, key: 'descriptionFra' },
      ],
  },
});
// tslint:enable:object-literal-sort-keys

// Set the path to the structures folder
const galleriesStructuresPath = path.join(__dirname, '..', '..', 'public', 'galleries', 'structures');

export class StructureController {
  constructor(
    @repository(StructureRepository) public structureRepository: StructureRepository,
    @repository(StructureLanguageRepository) public structureLanguageRepository: StructureLanguageRepository,
    @repository(StructuresViewRepository) public structuresViewRepository: StructuresViewRepository,
    @repository(StructuresCategoriesViewRepository) public structuresCategoriesViewRepository: StructuresCategoriesViewRepository,
    @repository(StructureImageRepository) public structureImageRepository: StructureImageRepository,
    @repository(IconRepository) public iconRepository: IconRepository,
    @repository(OrganizationUserRepository) public organizationUserRepository: OrganizationUserRepository,
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(FILE_UPLOAD_SERVICE) private fileUploadHandler: FileUploadHandler,
    @inject(SecurityBindings.USER) public user: UserProfile
  ) { }

  //*** INSERT ***/
  @post('/structures', {
    responses: {
      '200': {
        description: 'Structure model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Structure) } }
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureCreation, PermissionKeys.GeneralStructuresManagement] })
  async create(
    @requestBody({
      content: { 'application/json': { schema: getModelSchemaRef(Structure, {
        title: 'NewStructure',
        exclude: ['idStructure'],
      })}}
    })
    structure: Omit<Structure, 'idStructure'>,
  ): Promise<Structure> {
    // Get the current idOrganization
    if (this.user.userType !== 'gppOperator') {
      if (this.user.idOrganization) {
        structure.idOrganization = this.user.idOrganization;
      } else {
        throw new HttpErrors.BadRequest("Select an organization first");
      }
    }

    // Check if alias exists
    let aliasExists = true;
    let aliasCount = 0;
    let structureAlias = structure.alias;
    while (aliasExists) {
      aliasExists = await this.structureAliasExists(structureAlias);

      if (aliasExists) {
        aliasCount++;
        structureAlias = structure.alias + '_' + aliasCount;
      }
    }

    structure.alias = structureAlias;

    // Set the publication status based on logged user type
    if (this.user.userType === 'gppOperator') {
      structure.publicationStatus = 'published';
    } else if (this.user.userType === 'operator') {
      structure.publicationStatus = 'modification';
    }

    return this.structureRepository.create(structure);
  }

  //*** UPDATE ***/
  @patch('/structures/{id}', {
    responses: {
      '204': {
        description: 'Structure PATCH success',
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureUpdate, PermissionKeys.GeneralStructuresManagement] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': { schema: getModelSchemaRef(Structure, { partial: true })}
      }
    })
    structure: Structure,
  ): Promise<void> {
    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(id, this.user.idOrganization, this.structureRepository);
    }

    // Check if the alias is already assigned
    const filter: Filter = { where: { idStructure : { neq: id },  alias : structure.alias }};
    const aliasExists = await this.structureRepository.findOne(filter);

    if (aliasExists !== null) {
      throw new HttpErrors.Conflict("The alias specified is already assigned, please change it");
    }

    // Set the publication status based on logged user type
    if (this.user.userType === 'operator') {
      structure.publicationStatus = 'modification';
    }

    await this.structureRepository.updateById(id, structure);
  }

  //*** LIST ***/
  @get('/structures', {
    responses: {
      '200': {
        description: 'Array of Structure model instances',
        content: {
          'application/json': { schema: { type: 'array', items: getModelSchemaRef(StructuresView, { includeRelations: true })}}
        }
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureList, PermissionKeys.GeneralStructuresManagement] })
  async find(
    @param.query.object('filter', getFilterSchemaFor(StructuresView)) filter?: Filter<StructuresView>,
  ): Promise<StructuresView[]> {
    // If operator, show only the owned organizations
    if (this.user.userType !== 'gppOperator') {
      if (filter === undefined) {
        filter = {};
      }
      if (filter.where === undefined) {
        filter.where = {};
      }
      const queryFilters = new WhereBuilder<AnyObject>(filter?.where);

      if (this.user.userType === 'user') {
        const whereUser = queryFilters.impose({ publicationStatus: 'published' }).build();
        filter.where = whereUser;
      } else if (this.user.userType === 'operator') {
        const whereOperator = queryFilters.impose({ idOrganization: this.user.idOrganization }).build();
        filter.where = whereOperator;
      }
    }

    let categoryFilter = false;

    // Check filters
    if (filter !== undefined) {
      if (filter.where !== undefined) {
        // Check if specified the bounded coordinates
        const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
        if (filter.where.latitudeNorthWest && filter.where.longitudeNorthWest && filter.where.latitudeSouthEast && filter.where.longitudeSouthEast) {
          const where = queryFilters.impose({
            and : [{
              latitude: {between: [filter.where.latitudeSouthEast, filter.where.latitudeNorthWest]}, 
              longitude : {between: [filter.where.longitudeNorthWest, filter.where.longitudeSouthEast]}
            }]
          }).build();

          filter.where = where;
        }

        // Check if specified the category filter
        new WhereBuilder<AnyObject>(filter?.where);
        if (filter.where.idCategory) {
          categoryFilter = true;

          filter.include = [{
              "relation": "structuresCategoriesView",
              "scope": {
                "where": {"idCategory": filter.where.idCategory}
              }
            }]
        }
      }
    }
    
    let structuresReturn: StructuresView[] = [];
    const structViewRep = await this.structuresViewRepository.find(filter);
    
    // If specified the user position, calculate the distance from the structure
    if (filter !== undefined) {
      if (filter.where !== undefined) {
        const positionFilters = new WhereBuilder<AnyObject>(filter?.where);
        if (filter.where.userLatitude && filter.where.userLongitude) {
          const userPosition = new loopback.GeoPoint({lat: filter.where.userLatitude, lng: filter.where.userLongitude});
          for (let key1 in structViewRep) {
            const structurePosition = new loopback.GeoPoint({lat: structViewRep[key1]['latitude'], lng: structViewRep[key1]['longitude']});
            const distance = userPosition.distanceTo(structurePosition, {type: 'kilometers'});
            structViewRep[key1]['distance'] = distance;
          }
          //
          // Sorting based on distance
          structViewRep.sort((a, b) => a.distance! < b.distance! ? -1 : a.distance! > b.distance! ? 1 : 0);
        }
      }
    }

    structuresReturn = [];

    if (categoryFilter) {
      for (let key2 in structViewRep) {
        if (structViewRep[key2]['structuresCategoriesView']) {
          structuresReturn.push(structViewRep[key2]);
        }
      }
    } else {
      structuresReturn = structViewRep;
    }

    return structuresReturn;
  }

  //*** DETAILS ***/
  @get('/structures/{id}', {
    responses: {
      '200': {
        description: 'Structure model instance',
        content: {
          'application/json': { schema: getModelSchemaRef(Structure, { includeRelations: true })}
        }
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureDetail, PermissionKeys.GeneralStructuresManagement] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Structure)) filter?: Filter<Structure>
  ): Promise<Structure> {
    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(id, this.user.idOrganization, this.structureRepository);
    }

    return this.structureRepository.findById(id, filter);
  }

  //*** DELETE ***/
  @del('/structures/{id}', {
    responses: {
      '204': {
        description: 'Structure DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureDelete, PermissionKeys.GeneralStructuresManagement] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(id, this.user.idOrganization, this.structureRepository);
    }

    // Delete all the associated images
    const filter: Filter = { where: { "idStructure": id } };
    const structureImages = await this.structureImageRepository.find(filter);

    for (const structureImage of structureImages) {
       // Set the destination path
       const destPath = galleriesStructuresPath + '/' + structureImage.folder;

       // Check, if the file exists, it will be deleted
       if (fs.existsSync(destPath + "/" + structureImage.filename)) {
         fs.unlinkSync(destPath + "/" + structureImage.filename); // Remove the file
       }
 
       // Check, if there aren't files in the folder, it will be deleted
       const filesInDir = fs.readdirSync(destPath); 
       if (filesInDir.length === 0) {
         fs.rmdirSync(destPath); // Remove the folder
       }
    }

    await this.structureRepository.deleteById(id);
  }

  //*** SEND MESSAGE ***/
  @authenticate('jwt', { required: [PermissionKeys.StructureDetail] })
  @post('/structures/{id}/send-message', {
    responses: {
      '200': {
        description: 'Send Message to Structure',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                messageOutcome: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  async sendMessage(
    @param.path.string('id') id: string,
    @requestBody() structureMessage: StructureMessage,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile
  ): Promise<{ messageOutcome: OperationOutcome }> {
    let response : OperationOutcome = {
      code: '0',
      message: ''
    };
    const message = structureMessage.structureMessage;

    // Get the structure information
    const structure = await this.structureRepository.findById(id);

    if (structure) {
      if (structure.email) {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        let emailSubject = process.env.STRUCTURE_MESSAGE_EMAIL_SUBJECT;
        emailSubject = emailSubject?.replace(/%userEMail%/g, currentUser.email!);

        let emailText = process.env.STRUCTURE_MESSAGE_EMAIL_TEXT;
        emailText = emailText?.replace(/%userEMail%/g, currentUser.email!);
        emailText = emailText?.replace(/%message%/g, message);

        let htmlText = process.env.STRUCTURE_MESSAGE_EMAIL_HTML;
        htmlText = htmlText?.replace(/%userEMail%/g, currentUser.email!);
        htmlText = htmlText?.replace(/%message%/g, message);

        const msg = {
          to: structure.email,
          from: process.env.STRUCTURE_MESSAGE_EMAIL_FROM_EMAIL,
          replyTo: currentUser.email!,
          fromname: process.env.STRUCTURE_MESSAGE_EMAIL_FROM_NAME,
          subject: emailSubject,
          text: emailText,
          html: htmlText,
        }

        await sgMail
          .send(msg)
          .then(() => {
            response = {
              code: '202',
              message: 'Message sent'
            };
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch((error: any) => {
            console.error(error)
            response = {
              code: '20',
              message: 'Error sending e-mail'
            };
          })
      } else {
        response = {
          code: '11',
          message: 'Structure e-mail not specified'
        };
      }
    } else {
      response = {
        code: '10',
        message: 'Structure not exists'
      };
    }

    return Promise.resolve({ messageOutcome: response });
  }

  //*** LANGUAGES LIST ***/
  @get('/structures/{id}/structures-languages', {
    responses: {
      '200': {
        description: 'Array of StructureLanguage model instances',
        content: {
          'application/json': { schema: { type: 'array', items: getModelSchemaRef(StructureLanguage, {includeRelations: true})}}
        }
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureDetail, PermissionKeys.GeneralStructuresManagement] })
  async findLanguages(
    @param.path.string('id') id: string,
  ): Promise<StructureLanguage[]> {
    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(id, this.user.idOrganization, this.structureRepository);
    }

    const filter: Filter = { where: { "idStructure": id }, order: ["language"] };
    return this.structureLanguageRepository.find(filter);
  }

  //*** CATEGORIES LIST ***/
  @get('/structures/{id}/structures-categories', {
    responses: {
      '200': {
        description: 'Array of StructureCategory model instances',
        content: {
          'application/json': { schema: { type: 'array', items: getModelSchemaRef(StructuresCategoriesView, {includeRelations: true})}}
        }
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureDetail, PermissionKeys.GeneralStructuresManagement] })
  async findCategories(
    @param.path.string('id') id: string,
  ): Promise<StructuresCategoriesView[]> {
    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(id, this.user.idOrganization, this.structureRepository);
    }

    const filter: Filter = { where: { "idStructure": id } };
    return this.structuresCategoriesViewRepository.find(filter);
  }

  //*** IMAGES LIST ***/
  @get('/structures/{id}/structures-images', {
    responses: {
      '200': {
        description: 'Array of StructureImage model instances',
        content: {
          'application/json': { schema: { type: 'array', items: getModelSchemaRef(StructureImage, {includeRelations: true})}}
        }
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureDetail, PermissionKeys.GeneralStructuresManagement] })
  async findImages(
    @param.path.string('id') id: string,
  ): Promise<StructureImage[]> {
    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(id, this.user.idOrganization, this.structureRepository);
    }

    const filter: Filter = { where: { "idStructure": id } };
    return this.structureImageRepository.find(filter);
  }

  //*** IMPORT FILE EXCEL ***/
  @post('/structures/import-excel', {
    responses: {
      '200': {
        description: 'Import structures from Excel file',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                operationOutcome: {
                  type: 'object',
                },
              },
            },
          },
        },
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralStructuresManagement] })
  async importExcel(
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response
  ): Promise<OperationOutcome> {
    let responseImp = new Promise<OperationOutcome>((resolve, reject) => {
      this.fileUploadHandler(request, response, async (err) => {
        if (err) {
          // Multer error
          resolve(err);
        } else {
          let resp : OperationOutcome = {
            code : '0',
            message : ''
          }

          // Get the first file informations
          const filesAndFields = getFilesAndFields(request);
          const fileUploaded = filesAndFields.files[0];

          // Check if the file is xlsx
          if (fileUploaded.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            fs.unlinkSync(sandboxPath + "/" + fileUploaded.tempfilename); // Remove the temporary file
            reject(new HttpErrors.BadRequest('Please select an excel (xlsx) file'));
            return;
          }

          const config = excelConfig();
          const factory = new ImporterFactory();
          const importer = await factory.from(sandboxPath + "/" + fileUploaded.tempfilename);

          const items = importer.getAllItems<ExcelStructureRow>(config.items);

          let currentRow = 1;
          let importErrors = '';

          // First cycle: check errors
          for (const item of items) {
            currentRow++;

            // Check if alias is specified that is correct
            let aliasAssigned = false;
            let aliasExtension = 0;
            while (!aliasAssigned) {
              let alias = slugify(item.name);

              if (aliasExtension !== 0) {
                alias += '_' + aliasExtension;
              }

              // Check if the alias is already assigned
              const filterAlias: Filter = { where: { alias : alias }};
              const aliasExists = await this.structureRepository.findOne(filterAlias);

              if (aliasExists === null) {
                aliasAssigned = true;
              } else {
                aliasExtension++;
              }
            }

            // Check if name is specified
            if (!item.name) {
              importErrors += ' - Row: ' + currentRow + ': specify the name';
            } else {
              if (item.name.trim().length < 3) {
                importErrors += ' - Row: ' + currentRow + ': the name must be at least 3 characters long';
              }
            }

            // Check if latitude is numeric
            if (typeof(item.latitude) !== 'number') {
              importErrors += ' - Row: ' + currentRow + ': specify a numeric latitude';
            }

            // Check if longitude is numeric
            if (typeof(item.longitude) !== 'number') {
              importErrors += ' - Row: ' + currentRow + ': specify a numeric longitude';
            }

            // Check if icon exists
            if (item.icon) {
              const filterIcon: Filter = { where: { name : item.icon.trim() }};
              const iconExists = await this.iconRepository.findOne(filterIcon);

              if (!iconExists) {
                importErrors += ' - Row: ' + currentRow + ': the specified icon does not exist';
              }
            } else {
              importErrors += ' - Row: ' + currentRow + ': specify an icon';
            }
          }

          // Second cycle: get the values if no errors
          if (!importErrors) {
            let totalRows = 0;

            for (const item of items) {
              totalRows++;

              // Set the alias
              let alias = '';
              let aliasAssigned = false;
              let aliasExtension = 0;
              while (!aliasAssigned) {
                alias = slugify(item.name);
        
                if (aliasExtension !== 0) {
                  alias += '_' + aliasExtension;
                }
        
                // Check if the alias is already assigned
                const filterAlias: Filter = { where: { alias : alias }};
                const aliasExists = await this.structureRepository.findOne(filterAlias);
        
                if (aliasExists === null) {
                  aliasAssigned = true;
                } else {
                  aliasExtension++;
                }
              }
        
              // Set the name
              let name = item.name;

              // Set the address
              let address = item.address;

              // Set the city
              let city = item.city;

              // Set the latitude
              let latitude = item.latitude;

              // Set the longitude
              let longitude = item.longitude;

              // Set the email
              let email = item.email;

              // Set the phone number prefix
              let phoneNumberPrefix = item.phoneNumberPrefix;

              // Set the phone number
              let phoneNumber = item.phoneNumber;

              // Set the website
              let website = item.website;

              // Set the icon
              let idIcon = null;
              if (item.icon) {
                const filterIcon: Filter = { where: { name : item.icon.trim() }};
                const iconExists = await this.iconRepository.findOne(filterIcon);
        
                if (iconExists) {
                  idIcon = iconExists.idIcon;
                }
              }

              // Save the structure into db
              let structure : Omit<Structure, 'idStructure'> = {
                alias: alias,
                name: name,
                address : address,
                city : city,
                latitude : latitude,
                longitude : longitude,
                email : email,
                phoneNumberPrefix : phoneNumberPrefix,
                phoneNumber : phoneNumber,
                website : website,
                idIcon : idIcon
              };

              const createdStructure = await this.structureRepository.create(structure);

              // Set the english description
              let descriptionEng = item.descriptionEng;

              // Save the english language into db
              let structureLangEng : Omit<StructureLanguage, 'idStructureLanguage'> = {
                idStructure: createdStructure.idStructure,
                description: descriptionEng,
                language : 'en'
              };

              await this.structureLanguageRepository.create(structureLangEng);

              // Set the french description
              let descriptionFra = item.descriptionFra;
        
              // Save the french language into db
              let structureLangFra : Omit<StructureLanguage, 'idStructureLanguage'> = {
                idStructure: createdStructure.idStructure,
                description: descriptionFra,
                language : 'fr'
              };

              await this.structureLanguageRepository.create(structureLangFra);
            }

            resp = {
              code: '202',
              message: totalRows + ' structures imported from the excel file'
            };
          } else {
            resp = {
              code: '10',
              message: importErrors
            };
          }

          // Remove the temporary file
          fs.unlinkSync(sandboxPath + "/" + fileUploaded.tempfilename);

          resolve(resp);
        }
      });
    });

    return responseImp;
  }

  //*** EXPORT FILE EXCEL ***/
  @post('/structures/export-excel', {
    responses: {
      '200': {
        description: 'Export structures from Excel file',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                operationOutcome: {
                  type: 'object',
                },
              },
            },
          },
        },
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralStructuresManagement] })
  async exportExcel(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile
  ): Promise<{ excelExportOutcome: ExcelExportOutcome }> {
    let response : ExcelExportOutcome = {
      code: '0',
      message: '',
      filename: ''
    };

    let exportStructures : ExcelStructureRow[] = [];

    let structuresData = await this.structureRepository.find();

    for (let key1 in structuresData) {
      // Get english description
      const filterEng: Filter = { where: { "idStructure": structuresData[key1]['idStructure'], "language": "en" } };
      let descEng = await this.structureLanguageRepository.findOne(filterEng);

      // Get french description
      const filterFra: Filter = { where: { "idStructure": structuresData[key1]['idStructure'], "language": "fr" } };
      let descFra = await this.structureLanguageRepository.findOne(filterFra);

      // Get icon name
      const filterIco: Filter = { where: { "idIcon": structuresData[key1]['idIcon'] } };
      let descIco = await this.iconRepository.findOne(filterIco);

      const exportStructure = {
        alias: structuresData[key1]['alias'],
        name: structuresData[key1]['name'],
        address: structuresData[key1]['address'],
        city: structuresData[key1]['city'],
        latitude: structuresData[key1]['latitude'],
        longitude: structuresData[key1]['longitude'],
        email: structuresData[key1]['email'],
        phoneNumberPrefix: structuresData[key1]['phoneNumberPrefix'],
        phoneNumber: structuresData[key1]['phoneNumber'],
        website: structuresData[key1]['website'],
        icon: descIco?.name,
        descriptionEng: descEng?.description,
        descriptionFra: descFra?.description
      };

      exportStructures.push(exportStructure);
    }

    const filename = 'public/export/gpp-structures-' + Date.now();

    exportToExcel.exportXLSX({
      filename: filename,
      sheetname: 'structures',
      title: [
          {
            "fieldName": "alias",
            "displayName": "Alias",
            "cellWidth": 25
          },
          {
            "fieldName": "name",
            "displayName": "Name",
            "cellWidth": 30
          },
          {
            "fieldName": "address",
            "displayName": "Address",
            "cellWidth": 30
          },
          {
            "fieldName": "city",
            "displayName": "City",
            "cellWidth": 25
          },
          {
            "fieldName": "latitude",
            "displayName": "Latitude",
            "cellWidth": 15
          },
          {
            "fieldName": "longitude",
            "displayName": "Longitude",
            "cellWidth": 15
          },
          {
            "fieldName": "email",
            "displayName": "E-Mail",
            "cellWidth": 25
          },
          {
            "fieldName": "phoneNumberPrefix",
            "displayName": "Phone Number Prefix",
            "cellWidth": 6,
          },
          {
            "fieldName": "phoneNumber",
            "displayName": "Phone Number",
            "cellWidth": 15,
          },
          {
            "fieldName": "website",
            "displayName": "Website",
            "cellWidth": 30,
          },
          {
            "fieldName": "icon",
            "displayName": "Icon",
            "cellWidth": 15,
          },
          {
            "fieldName": "descriptionEng",
            "displayName": "Description English",
            "cellWidth": 50,
          },
          {
            "fieldName": "descriptionFra",
            "displayName": "Description French",
            "cellWidth": 50,
          }
      ],
      data: exportStructures
    })

    response = {
      code: '202',
      message: 'Export completed',
      filename: filename + '.xlsx'
    };

    return Promise.resolve({ excelExportOutcome: response });
  }

  //*** REQUEST PUBLICATION ***/
  @authenticate('jwt', { required: [PermissionKeys.StructureUpdate, PermissionKeys.GeneralStructuresManagement] })
  @post('/structures/{id}/request-publication', {
    responses: {
      '200': {
        description: 'Send request publication of the structure',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                messageOutcome: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  async requestPublication(
    @param.path.string('id') id: string,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile
  ): Promise<{ messageOutcome: OperationOutcome }> {
    let response : OperationOutcome = {
      code: '0',
      message: ''
    };

    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(id, this.user.idOrganization, this.structureRepository);
    }

    // Get the structure information
    const structure = await this.structureRepository.findById(id);

    if (structure) {
      structure.publicationStatus = 'requestPublication';
      await this.structureRepository.updateById(id, structure);

      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      let emailSubject = process.env.STRUCTURE_REQUEST_PUBLICATION_EMAIL_SUBJECT;
      emailSubject = emailSubject?.replace(/%structureName%/g, structure.name!);

      let emailText = process.env.STRUCTURE_REQUEST_PUBLICATION_EMAIL_TEXT;
      emailText = emailText?.replace(/%structureName%/g, structure.name!);

      let htmlText = process.env.STRUCTURE_REQUEST_PUBLICATION_EMAIL_HTML;
      htmlText = htmlText?.replace(/%structureName%/g, structure.name!);

      let adminEMails: string[] = [];
      const adminEMailsENV = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS : '';
      adminEMails = adminEMailsENV?.split(',');

      const msg = {
        to: adminEMails,
        from: process.env.STRUCTURE_REQUEST_PUBLICATION_EMAIL_FROM_EMAIL,
        replyTo: currentUser.email!,
        fromname: process.env.STRUCTURE_REQUEST_PUBLICATION_EMAIL_FROM_NAME,
        subject: emailSubject,
        text: emailText,
        html: htmlText,
      }

      await sgMail
        .send(msg)
        .then(() => {
          response = {
            code: '202',
            message: 'Request publication confirmed and message sent'
          };
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: any) => {
          console.error(error)
          response = {
            code: '201',
            message: 'Request publication confirmed but message not sent'
          };
        })
    } else {
      response = {
        code: '10',
        message: 'Structure not exists'
      };
    }

    return Promise.resolve({ messageOutcome: response });
  }

  //*** STRUCTURE PUBLICATION ***/
  @authenticate('jwt', { required: [PermissionKeys.GeneralStructuresManagement] })
  @post('/structures/{id}/publication', {
    responses: {
      '200': {
        description: 'Send publication or rejection of the structure',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                messageOutcome: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  async publication(
    @param.path.string('id') id: string,
    @requestBody() publicationOperation: PublicationOperation,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile
  ): Promise<{ messageOutcome: OperationOutcome }> {
    let response : OperationOutcome = {
      code: '0',
      message: ''
    };

    // Get the structure information
    const structure = await this.structureRepository.findById(id);

    if (structure) {
      structure.publicationStatus = publicationOperation.publicationStatus;
      structure.rejectionDescription = publicationOperation.rejectionMessage;
      await this.structureRepository.updateById(id, structure);

      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      // Get the structure administrator email
      let toEmails = [];
      const filterAdmins: Filter = { where: { "idOrganization": structure.idOrganization} };
      const organizationUsers = await this.organizationUserRepository.find(filterAdmins);

      for (let key in organizationUsers) {
        if (organizationUsers[key]['idUser']) {
          const filterUser: Filter = { where: { "idUser": organizationUsers[key]['idUser']} };
          const user = await this.userRepository.findOne(filterUser);
          if (user) {
            toEmails.push(user.email);
          }
        }
      }

      let adminEMails: string[] = [];
      const adminEMailsENV = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS : '';
      adminEMails = adminEMailsENV?.split(',');

      if (toEmails.length > 0) {
        switch (publicationOperation.publicationStatus) {
          case 'published':
            let emailSubject = process.env.STRUCTURE_PUBLISHED_EMAIL_SUBJECT;
            emailSubject = emailSubject?.replace(/%structureName%/g, structure.name!);
          
            let emailText = process.env.STRUCTURE_PUBLISHED_EMAIL_TEXT;
            emailText = emailText?.replace(/%structureName%/g, structure.name!);
          
            let htmlText = process.env.STRUCTURE_PUBLISHED_EMAIL_HTML;
            htmlText = htmlText?.replace(/%structureName%/g, structure.name!);

            const msg = {
              to: toEmails,
              from: process.env.STRUCTURE_PUBLISHED_EMAIL_FROM_EMAIL,
              replyTo: adminEMails[0],
              fromname: process.env.STRUCTURE_PUBLISHED_EMAIL_FROM_NAME,
              subject: emailSubject,
              text: emailText,
              html: htmlText,
            }

            await sgMail
              .send(msg)
              .then(() => {
                response = {
                  code: '202',
                  message: 'Publication confirmed and message sent'
                };
              })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .catch((error: any) => {
                console.error(error)
                response = {
                  code: '201',
                  message: 'Publication confirmed but message not sent'
                };
              })
          break;

          case 'rejected':
            let emailSubject2 = process.env.STRUCTURE_REJECTED_EMAIL_SUBJECT;
            emailSubject2 = emailSubject2?.replace(/%structureName%/g, structure.name!);
      
            let emailText2 = process.env.STRUCTURE_REJECTED_EMAIL_TEXT;
            emailText2 = emailText2?.replace(/%structureName%/g, structure.name!);
            emailText2 = emailText2?.replace(/%rejectionReason%/g, publicationOperation.rejectionMessage!);
      
            let htmlText2 = process.env.STRUCTURE_REJECTED_EMAIL_HTML;
            htmlText2 = htmlText2?.replace(/%structureName%/g, structure.name!);
            htmlText2 = htmlText2?.replace(/%rejectionReason%/g, publicationOperation.rejectionMessage!);

            const msg2 = {
              to: toEmails,
              from: process.env.STRUCTURE_REJECTED_EMAIL_FROM_EMAIL,
              replyTo: adminEMails[0],
              fromname: process.env.STRUCTURE_REJECTED_EMAIL_FROM_NAME,
              subject: emailSubject2,
              text: emailText2,
              html: htmlText2,
            }

            await sgMail
              .send(msg2)
              .then(() => {
                response = {
                  code: '202',
                  message: 'Rejection confirmed and message sent'
                };
              })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .catch((error: any) => {
                console.error(error)
                response = {
                  code: '201',
                  message: 'Rejection confirmed but message not sent'
                };
              })
          break;
        }
      }
    } else {
      response = {
        code: '10',
        message: 'Structure not exists'
      };
    }

    return Promise.resolve({ messageOutcome: response });
  }

  // Check if the alias is already assigned
  private async structureAliasExists(currentAlias : string) {
    const filter: Filter = { where: { alias : currentAlias }};
    const aliasExists = await this.structureRepository.findOne(filter);

    if (aliasExists !== null) {
      return true;
    } else {
      return false;
    }
  }
}
