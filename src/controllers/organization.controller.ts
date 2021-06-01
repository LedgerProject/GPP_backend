//Loopback imports
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { repository, Filter } from '@loopback/repository';
import { getModelSchemaRef, del, get, post, patch, param, requestBody, HttpErrors, getFilterSchemaFor } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { Organization, OrganizationUser } from '../models';
import { OrganizationRepository, OrganizationUserRepository } from '../repositories';
import { checkOrganizationOwner } from '../services/organization.service';

export class OrganizationController {
  constructor(
    @repository(OrganizationRepository) public organizationRepository: OrganizationRepository,
    @repository(OrganizationUserRepository) public organizationUserRepository: OrganizationUserRepository,
    @inject(SecurityBindings.USER) public user: UserProfile
  ) { }

  /*** INSERT ***/
  @post('/organizations', {
    responses: {
      '200': {
        description: 'Organization model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Organization) } },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.OrganizationCreation, PermissionKeys.GeneralOrganizationManagement] })
  async create(
    @requestBody({
      content: {
        'application/json': { schema: getModelSchemaRef(Organization, {title: 'NewOrganization', exclude: ['idOrganization']})}
      }
    })
    organization: Omit<Organization, 'idOrganization'>,
  ): Promise<Organization> {
    // Check if the name is already assigned
    const filter: Filter = { where: { name : organization.name }};
    const nameExists = await this.organizationRepository.findOne(filter);

    if (nameExists !== null) {
      throw new HttpErrors.Conflict("The name specified is already assigned, please change it");
    }

    // Organization creation
    const createdOrganization = await this.organizationRepository.create(organization);

    // Organizazion-User creation (owner user is admnistrator)
    const organizationUser = new OrganizationUser({
      idOrganization: createdOrganization.idOrganization,
      idUser: this.user.idUser,
      permissions: ["OrganizationAdministrator"],
      confirmed: true,
    });
    await this.organizationUserRepository.create(organizationUser);

    // Return the created organization
    return createdOrganization;
  }

  /*** LIST ***/
  @get('/organizations', {
    responses: {
      '200': {
        description: 'Array of Organization model instances',
        content: {'application/json': { schema: { type: 'array', items: getModelSchemaRef(Organization, {includeRelations: true})}}}
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralOrganizationManagement] })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Organization)) filter?: Filter<Organization>,
  ): Promise<Organization[]> {
    return this.organizationRepository.find(filter);
  }

  /*** DETAILS ***/
  @get('/organizations/{id}', {
    responses: {
      '200': {
        description: 'Organization model instance',
        content: {'application/json': { schema: getModelSchemaRef(Organization, {includeRelations: true})}}
      }
    }
  })
  @authenticate('jwt', { required: [PermissionKeys.OrganizationDetail, PermissionKeys.GeneralOrganizationManagement] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Organization)) filter?: Filter<Organization>
  ): Promise<Organization> {
    // If operator, check if it is an owned organization
    if (this.user.userType !== 'gppOperator') {
      await checkOrganizationOwner(id, this.user.idUser, this.organizationRepository);
    }

    return this.organizationRepository.findById(id, filter);
  }

  /*** UPDATE ***/
  @patch('/organizations/{id}', {
    responses: {
      '204': {
        description: 'Organization PATCH success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.OrganizationCreation, PermissionKeys.GeneralOrganizationManagement] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': { schema: getModelSchemaRef(Organization, {partial: true})}
      }
    })
    organization: Organization,
  ): Promise<void> {
    // If operator, check if it is an owned organization
    if (this.user.userType !== 'gppOperator') {
      await checkOrganizationOwner(id, this.user.idUser, this.organizationRepository);
    }

    // Check if the name is already assigned
    const filter: Filter = { where: { idOrganization : { neq : id}, name : organization.name }};
    const nameExists = await this.organizationRepository.findOne(filter);

    if (nameExists !== null) {
      throw new HttpErrors.Conflict("The name specified is already assigned, please change it");
    }

    // Return the updated organization
    await this.organizationRepository.updateById(id, organization);
  }

  /*** DELETE ***/
  @del('/organizations/{id}', {
    responses: {
      '204': {
        description: 'Organization DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.OrganizationDelete, PermissionKeys.GeneralOrganizationManagement] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    // If operator, check if it is an owned organization
    if (this.user.userType !== 'gppOperator') {
      await checkOrganizationOwner(id, this.user.idUser, this.organizationRepository);
    }
    
    await this.organizationRepository.deleteById(id);
  }
}
