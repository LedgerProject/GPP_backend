import {Count, CountSchema, Filter, repository, Where} from '@loopback/repository';
import {post, param, get, getFilterSchemaFor, getModelSchemaRef, getWhereSchemaFor, patch, put, del, requestBody} from '@loopback/rest';
import {Organization, OrganizationUser} from '../models';
import {OrganizationRepository, OrganizationUserRepository} from '../repositories';
import { inject } from '@loopback/core'
import { authenticate } from '@loopback/authentication';
import {securityId, SecurityBindings, UserProfile} from '@loopback/security';
import { PermissionKeys } from '../authorization/permission-keys';

export class OrganizationController {
  constructor(
    @repository(OrganizationRepository)
    public organizationRepository : OrganizationRepository,
    @repository(OrganizationUserRepository)
    public organizationUserRepository : OrganizationUserRepository,
    @inject(SecurityBindings.USER)
    public user: UserProfile
  ) {}

  /*** ORGANIZATION CREATION ***/
  @authenticate('jwt', { required: [PermissionKeys.OrganizationCreation] })
  @post('/organizations', {
    responses: {
      '200': {
        description: 'Organization model instance',
        content: {'application/json': {schema: getModelSchemaRef(Organization)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Organization, {
            title: 'NewOrganization',
            exclude: ['idOrganization'],
          }),
        },
      },
    })
    organization: Omit<Organization, 'idOrganization'>,
  ): Promise<Organization> {
    // Organization creation
    let createdOrganization = await this.organizationRepository.create(organization);

    // Organizazion-User creation (owner user is admnistrator)
    let organizationUser = new OrganizationUser({
      idOrganization: createdOrganization.idOrganization,
      idUser: this.user.idUser,
      accessLevel: "administrator",
      confirmed: true,
    });
    await this.organizationUserRepository.create(organizationUser);

    // Return the created organization
    return createdOrganization;
  }
}
