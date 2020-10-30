import { inject, Getter} from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import { GppDataSource } from '../datasources';
import { User, UserRelations, UserToken, OrganizationUser} from '../models';
import {OrganizationUserRepository} from './organization-user.repository';

export type Credentials = {
  userType: string;
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {

  public readonly userTokens: HasManyRepositoryFactory<UserToken, typeof User.prototype.idUser>;

  public readonly organizationUsers: HasManyRepositoryFactory<OrganizationUser, typeof User.prototype.idUser>;

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource, @repository.getter('OrganizationUserRepository') protected organizationUserRepositoryGetter: Getter<OrganizationUserRepository>,
  ) {
    super(User, dataSource);
    this.organizationUsers = this.createHasManyRepositoryFactoryFor('organizationUsers', organizationUserRepositoryGetter,);
    this.registerInclusionResolver('organizationUsers', this.organizationUsers.inclusionResolver);
  }
}
