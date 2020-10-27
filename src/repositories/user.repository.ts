import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { GppDatasourceDataSource } from '../datasources';
import { User, UserRelations } from '../models';

export type Credentials = {
  email: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {

  constructor(
    @inject('datasources.Gpp') dataSource: GppDatasourceDataSource,
  ) {
    super(User, dataSource);
  }
}
