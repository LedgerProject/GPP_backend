//Loopback imports
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { AnyObject, Filter, repository, WhereBuilder } from '@loopback/repository';
import { del, get, getFilterSchemaFor, getModelSchemaRef, HttpErrors, param, patch, post, requestBody } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { Structure, StructuresCategoriesView, StructureLanguage, StructuresView, StructureImage } from '../models';
import { StructureRepository, StructuresCategoriesViewRepository, StructureLanguageRepository, StructuresViewRepository, StructureImageRepository, IconRepository } from '../repositories';
import { checkStructureOwner } from '../services/structure.service';
import { ImporterFactory } from 'xlsx-import/lib/ImporterFactory';

const exportToExcel = require('export-to-excel');
const loopback = require('loopback');
const fs = require('fs');
const path = require('path');

interface StructureMessage {
  structureMessage: string;
}

interface OperationOutcome {
  code: string;
  message: string;
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
    @repository(StructureRepository)
    public structureRepository: StructureRepository,
    @repository(StructureLanguageRepository)
    public structureLanguageRepository: StructureLanguageRepository,
    @repository(StructuresViewRepository)
    public structuresViewRepository: StructuresViewRepository,
    @repository(StructuresCategoriesViewRepository)
    public structuresCategoriesViewRepository: StructuresCategoriesViewRepository,
    @repository(StructureImageRepository)
    public structureImageRepository: StructureImageRepository,
    @repository(IconRepository)
    public iconRepository: IconRepository,
    @inject(SecurityBindings.USER)
    public user: UserProfile
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

    // Check if the alias is already assigned
    const filter: Filter = { where: { alias : structure.alias }};
    const aliasExists = await this.structureRepository.findOne(filter);

    if (aliasExists !== null) {
      throw new HttpErrors.Conflict("The alias specified is already assigned, please change it");
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
      const where = queryFilters.impose({ idOrganization: this.user.idOrganization }).build();

      filter.where = where;
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
    @requestBody()
    structureMessage: StructureMessage,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
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
  @post('/import-excel', {
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
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<{ operationOutcome: OperationOutcome }> {
    let response : OperationOutcome = {
      code: '0',
      message: ''
    };
    const config = excelConfig();

    const factory = new ImporterFactory();
    
    const importer = await factory.from('public/temp/test2.xlsx');

    const items = importer.getAllItems<ExcelStructureRow>(config.items);

    let currentRow = 0;
    let importErrors = '';

    for (const item of items) {
      // Check if alias is specified that is correct
      
      // Check if name is specified

    }

    return Promise.resolve({ operationOutcome: response });
  }

  //*** EXPORT FILE EXCEL ***/
  @post('/export-excel', {
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
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<{ operationOutcome: OperationOutcome }> {
    let response : OperationOutcome = {
      code: '0',
      message: ''
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

    exportToExcel.exportXLSX({
      filename: 'public/export/gpp-structures-' + Date.now(),
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

    return Promise.resolve({ operationOutcome: response });
  }
}
