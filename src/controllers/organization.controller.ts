//Loopback imports
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { getModelSchemaRef, post, requestBody } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { Organization, OrganizationUser } from '../models';
import { OrganizationRepository, OrganizationUserRepository } from '../repositories';

export class OrganizationController {
  constructor(
    @repository(OrganizationRepository)
    public organizationRepository: OrganizationRepository,
    @repository(OrganizationUserRepository)
    public organizationUserRepository: OrganizationUserRepository,
    @inject(SecurityBindings.USER)
    public user: UserProfile
  ) { }

  /*** ORGANIZATION CREATION ***/
  @authenticate('jwt', { required: [PermissionKeys.OrganizationCreation] })
  @post('/organizations', {
    responses: {
      '200': {
        description: 'Organization model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Organization) } },
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
}
