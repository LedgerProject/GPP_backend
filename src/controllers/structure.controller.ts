//Loopback imports
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { AnyObject, Filter, repository, WhereBuilder } from '@loopback/repository';
import { del, get, getFilterSchemaFor, getModelSchemaRef, HttpErrors, param, patch, post, requestBody } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { Structure, StructuresCategoriesView, StructureLanguage, StructuresView } from '../models';
import { StructureRepository, StructuresCategoriesViewRepository, StructureLanguageRepository, StructuresViewRepository } from '../repositories';
import { checkStructureOwner } from '../services/structure.service';

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
    @inject(SecurityBindings.USER)
    public user: UserProfile
  ) { }

  //*** INSERT ***/
  @post('/structures', {
    responses: {
      '200': {
        description: 'Structure model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Structure) } },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureCreation, PermissionKeys.GeneralStructuresManagement] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Structure, {
            title: 'NewStructure',
            exclude: ['idStructure'],
          }),
        },
      },
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

    return this.structureRepository.create(structure);
  }

  //*** UPDATE ***/
  @patch('/structures/{id}', {
    responses: {
      '204': {
        description: 'Structure PATCH success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureUpdate, PermissionKeys.GeneralStructuresManagement] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Structure, { partial: true }),
        },
      },
    })
    structure: Structure,
  ): Promise<void> {
    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(id, this.user.idOrganization, this.structureRepository);
    }

    await this.structureRepository.updateById(id, structure);
  }

  //*** LIST ***/
  @get('/structures', {
    responses: {
      '200': {
        description: 'Array of Structure model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(StructuresView, { includeRelations: true }),
            },
          },
        },
      },
    },
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
    return this.structuresViewRepository.find(filter);
  }

  //*** DETAILS ***/
  @get('/structures/{id}', {
    responses: {
      '200': {
        description: 'Structure model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Structure, { includeRelations: true }),
          },
        },
      },
    },
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

    await this.structureRepository.deleteById(id);
  }

  //*** LANGUAGES LIST ***/
  @get('/structures/{id}/structures-languages', {
    responses: {
      '200': {
        description: 'Array of StructureLanguage model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(StructureLanguage, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureDetail, PermissionKeys.GeneralStructuresManagement] })
  async findLanguages(
    @param.path.string('id') id: string,
  ): Promise<StructureLanguage[]> {
    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(id, this.user.idOrganization, this.structureRepository);
    }

    const filter: Filter = { where: { "idStructure": id } };
    return this.structureLanguageRepository.find(filter);
  }

  //*** CATEGORIES LIST ***/
  @get('/structures/{id}/structures-categories', {
    responses: {
      '200': {
        description: 'Array of StructureCategory model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(StructuresCategoriesView, {includeRelations: true}),
            },
          },
        },
      },
    },
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
}
