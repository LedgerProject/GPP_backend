//Loopback imports
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { AnyObject, Filter, repository, WhereBuilder } from '@loopback/repository';
import { del, get, getFilterSchemaFor, getModelSchemaRef, HttpErrors, param, patch, post, requestBody } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { Structure, StructuresMapSearchView, StructuresCategoriesView, StructureLanguage, StructuresView, StructureImage } from '../models';
import { StructureRepository, StructuresMapSearchViewRepository, StructuresCategoriesViewRepository, StructureLanguageRepository, StructuresViewRepository, StructureImageRepository } from '../repositories';
import { checkStructureOwner } from '../services/structure.service';

const fs = require('fs');
const path = require('path');

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
    @repository(StructuresMapSearchViewRepository)
    public structuresMapSearchViewRepository: StructuresMapSearchViewRepository,
    @repository(StructuresCategoriesViewRepository)
    public structuresCategoriesViewRepository: StructuresCategoriesViewRepository,
    @repository(StructureImageRepository)
    public structureImageRepository: StructureImageRepository,
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

    // Check if specified the bounded coordinates
    if (filter !== undefined) {
      if (filter.where !== undefined) {
        const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
        if (filter.where.latitudeNorthWest && filter.where.longitudeNorthWest && filter.where.latitudeSouthEast && filter.where.longitudeSouthEast) {
          const where = queryFilters.impose({ 
            latitude: {lt: filter.where.latitudeNorthWest, gt: filter.where.latitudeSouthEast}, 
            longitude : {gt: filter.where.longitudeNorthWest, lt: filter.where.longitudeSouthEast},
          }).build();

          filter.where = where;
        }
      }
    }

    return this.structuresViewRepository.find(filter);
  }

  //*** LIST MAP-SEARCH ***/
  @get('/structures/map-search', {
    responses: {
      '200': {
        description: 'Array of StructureMapSearchView model instances',
        content: {
          'application/json': { schema: { type: 'array', items: getModelSchemaRef(StructuresMapSearchView, {includeRelations: true})}}
        }
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureList] })
  async findStructuresMapSearch(
    @param.query.object('filter', getFilterSchemaFor(StructuresMapSearchView)) filter?: Filter<StructuresMapSearchView>,
  ): Promise<StructuresMapSearchView[]> {
    // Check if specified the bounded coordinates
    if (filter !== undefined) {
      if (filter.where !== undefined) {
        const queryFilters = new WhereBuilder<AnyObject>(filter?.where);
        if (filter.where.latitudeNorthWest && filter.where.longitudeNorthWest && filter.where.latitudeSouthEast && filter.where.longitudeSouthEast) {
          const where = queryFilters.impose({ and : [{
            structureLatitude: {between: [filter.where.latitudeSouthEast, filter.where.latitudeNorthWest]}, 
            structureLongitude : {between: [filter.where.longitudeNorthWest, filter.where.longitudeSouthEast]}}]
          }).build();

          filter.where = where;
        }
      }
    }

    return this.structuresMapSearchViewRepository.find(filter);
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
}
