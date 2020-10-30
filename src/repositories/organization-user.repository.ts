import {DefaultCrudRepository} from '@loopback/repository';
import {OrganizationUser, OrganizationUserRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

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
