//Loopback imports
import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
//GPP imports
import { GppDataSource } from '../datasources';
import { Organization, OrganizationRelations } from '../models';

export class OrganizationRepository extends DefaultCrudRepository<
  Organization,
  typeof Organization.prototype.idOrganization,
  OrganizationRelations
  > {

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(Organization, dataSource);
  }
}
