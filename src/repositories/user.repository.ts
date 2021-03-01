//Loopback imports
import { Getter, inject } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
//GPP imports
import { GppDataSource } from '../datasources';
import { OrganizationUser, User, UserRelations, UserToken } from '../models';
import { OrganizationUserRepository } from './organization-user.repository';

export type Credentials = {
  userType: string;
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.idUser,
  UserRelations
  > {
  public readonly userTokens: HasManyRepositoryFactory<
  UserToken, 
  typeof User.prototype.idUser
  >;
  public readonly organizationUser: HasManyRepositoryFactory<
  OrganizationUser,
  typeof User.prototype.idUser
  >;
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('OrganizationUserRepository')
    organizationUserRepositoryGetter: Getter<OrganizationUserRepository>,
  ) {
    super(User, dataSource);
    this.organizationUser = this.createHasManyRepositoryFactoryFor('organizationUser', organizationUserRepositoryGetter);

    this.registerInclusionResolver('organizationUser', this.organizationUser.inclusionResolver);
  }
}
