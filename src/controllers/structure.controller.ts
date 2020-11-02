//Loopback imports
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { AnyObject, Filter, repository, WhereBuilder } from '@loopback/repository';
import { del, get, getFilterSchemaFor, getModelSchemaRef, HttpErrors, param, patch, post, requestBody } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { Structure, StructuresView } from '../models';
import { StructureRepository, StructuresViewRepository } from '../repositories';

export class StructureController {
  constructor(
    @repository(StructureRepository)
    public structureRepository: StructureRepository,
    @repository(StructuresViewRepository)
    public structuresViewRepository: StructuresViewRepository,
    @inject(SecurityBindings.USER)
    public user: UserProfile
  ) { }

  //*** NEW STRUCTURE ***/
  @authenticate('jwt', { required: [PermissionKeys.StructureCreation, PermissionKeys.GeneralStructuresManagement] })
  @post('/structures', {
    responses: {
      '200': {
        description: 'Structure model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Structure) } },
      },
    },
  })
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
    if (this.user.userType === 'operator') {
      if (this.user.idOrganization) {
        structure.idOrganization = this.user.idOrganization;
      } else {
        throw new HttpErrors.BadRequest("Select an organization first");
      }
    }

    return this.structureRepository.create(structure);
  }

  //*** STRUCTURE UPDATE ***/
  @authenticate('jwt', { required: [PermissionKeys.StructureUpdate, PermissionKeys.GeneralStructuresManagement] })
  @patch('/structures/{id}', {
    responses: {
      '204': {
        description: 'Structure PATCH success',
      },
    },
  })
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
    if (this.user.userType === 'operator') {
      const filterOwner: Filter = { where: { "idStructure": id, "idOrganization": this.user.idOrganization } };
      const structureOwned = await this.structureRepository.findOne(filterOwner);
      if (!structureOwned) {
        throw new HttpErrors.Forbidden("Structure not owned");
      }
    }

    await this.structureRepository.updateById(id, structure);
  }

  //*** STRUCTURES LIST ***/
  @authenticate('jwt', { required: [PermissionKeys.StructureList, PermissionKeys.GeneralStructuresManagement] })
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
  async find(
    @param.query.object('filter', getFilterSchemaFor(StructuresView)) filter?: Filter<StructuresView>,
  ): Promise<StructuresView[]> {
    // If operator, show only the owned organizations
    if (this.user.userType === 'operator') {
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

  //*** STRUCTURE DETAIL ***/
  @authenticate('jwt', { required: [PermissionKeys.StructureDetail, PermissionKeys.GeneralStructuresManagement] })
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
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Structure)) filter?: Filter<Structure>
  ): Promise<Structure> {
    // If operator, check if it is an owned structure
    if (this.user.userType === 'operator') {
      await this.checkStructureOwner(id, this.user.idOrganization);
    }

    return this.structureRepository.findById(id, filter);
  }

  //*** STRUCTURE DELETE ***/
  @authenticate('jwt', { required: [PermissionKeys.StructureDelete, PermissionKeys.GeneralStructuresManagement] })
  @del('/structures/{id}', {
    responses: {
      '204': {
        description: 'Structure DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    // If operator, check if it is an owned structure
    if (this.user.userType === 'operator') {
      await this.checkStructureOwner(id, this.user.idOrganization);
    }

    await this.structureRepository.deleteById(id);
  }

  async checkStructureOwner(idStructure: string, idOrganization: string) {
    const filterOwner: Filter = { where: { "idStructure": idStructure, "idOrganization": idOrganization } };
    const structureOwned = await this.structureRepository.findOne(filterOwner);
    if (!structureOwned) {
      throw new HttpErrors.Forbidden("Structure not owned");
    }
  }
}
