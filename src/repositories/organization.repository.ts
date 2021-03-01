//Loopback imports
import { Getter, inject } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
//GPP imports
import { GppDataSource } from '../datasources';
import { Organization, OrganizationRelations, OrganizationUser } from '../models';
import { OrganizationUserRepository } from './organization-user.repository';

export class OrganizationRepository extends DefaultCrudRepository<
  Organization,
  typeof Organization.prototype.idOrganization,
  OrganizationRelations
  >
  {
  public readonly organizationUser: HasManyRepositoryFactory<
  OrganizationUser,
  typeof Organization.prototype.idOrganization
  >;
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('OrganizationUserRepository')
    organizationUserRepositoryGetter: Getter<OrganizationUserRepository>,
  ) {
    super(Organization, dataSource);
    this.organizationUser = this.createHasManyRepositoryFactoryFor('organizationUser', organizationUserRepositoryGetter);

    this.registerInclusionResolver('organizationUser', this.organizationUser.inclusionResolver);
  }
}
