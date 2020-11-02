//Loopback imports
import { inject } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory } from '@loopback/repository';
//GPP imports
import { GppDataSource } from '../datasources';
import { User, UserRelations, UserToken } from '../models';

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

  public readonly userTokens: HasManyRepositoryFactory<UserToken, typeof User.prototype.idUser>;

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(User, dataSource);
  }
}
