//Loopback imports
import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { GppDataSource } from '../datasources';
//GPP imports
import { OrganizationsUsersView, OrganizationsUsersViewRelations } from '../models';

export class OrganizationsUsersViewRepository extends DefaultCrudRepository
  <OrganizationsUsersView, typeof OrganizationsUsersView.prototype.idOrganizationUser, OrganizationsUsersViewRelations> {

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(OrganizationsUsersView, dataSource);
  }
}
