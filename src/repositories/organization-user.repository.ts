//Loopback imports
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
//GPP imports
import { GppDataSource } from '../datasources';
import { Organization, OrganizationUser, OrganizationUserRelations, User } from '../models';
import { OrganizationRepository } from './organization.repository';
import { UserRepository } from './user.repository';

export class OrganizationUserRepository extends DefaultCrudRepository<
  OrganizationUser,
  typeof OrganizationUser.prototype.idOrganizationUser,
  OrganizationUserRelations
  > {
  public readonly organization: BelongsToAccessor<
  Organization,
  typeof OrganizationUser.prototype.idOrganization
  >;
  public readonly user: BelongsToAccessor<
  User,
  typeof OrganizationUser.prototype.idUser
  >;
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('OrganizationRepository')
    protected organizationRepositoryGetter: Getter<OrganizationRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(OrganizationUser, dataSource);
    this.organization = this.createBelongsToAccessorFor('organization', organizationRepositoryGetter);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);

    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
