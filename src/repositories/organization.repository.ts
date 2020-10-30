import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Organization, OrganizationRelations, OrganizationUser} from '../models';
import {GppDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {OrganizationUserRepository} from './organization-user.repository';

export class OrganizationRepository extends DefaultCrudRepository<
  Organization,
  typeof Organization.prototype.idOrganization,
  OrganizationRelations
> {

  public readonly organizationUsers: HasManyRepositoryFactory<OrganizationUser, typeof Organization.prototype.idOrganization>;

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource, @repository.getter('OrganizationUserRepository') protected organizationUserRepositoryGetter: Getter<OrganizationUserRepository>,
  ) {
    super(Organization, dataSource);
    this.organizationUsers = this.createHasManyRepositoryFactoryFor('organizationUsers', organizationUserRepositoryGetter,);
    this.registerInclusionResolver('organizationUsers', this.organizationUsers.inclusionResolver);
  }
}
