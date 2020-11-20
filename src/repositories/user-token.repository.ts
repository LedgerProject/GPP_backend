// Loopback imports
import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
// GPP imports
import { GppDataSource } from '../datasources';
import { User, UserToken } from '../models';

export class UserTokenRepository extends DefaultCrudRepository<
  UserToken, typeof User.prototype.idUser
  > {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(UserToken, dataSource);
  }
}
