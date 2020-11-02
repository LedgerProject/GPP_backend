//Loopback imports
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { AnyObject, Filter, repository, WhereBuilder } from '@loopback/repository';
import { get, getFilterSchemaFor, getModelSchemaRef, HttpErrors, param, post, requestBody } from '@loopback/rest';
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
    console.log(this.user.userType);
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
    console.log(filter);
    return this.structuresViewRepository.find(filter);
  }
}
