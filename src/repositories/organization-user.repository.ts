//Loopback imports
import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
//GPP imports
import { GppDataSource } from '../datasources';
import { OrganizationUser, OrganizationUserRelations } from '../models';

export class OrganizationUserRepository extends DefaultCrudRepository<
  OrganizationUser,
  typeof OrganizationUser.prototype.idOrganizationUser,
  OrganizationUserRelations
  > {

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(OrganizationUser, dataSource);
  }
}
