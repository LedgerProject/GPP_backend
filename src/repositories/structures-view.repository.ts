import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { GppDataSource } from '../datasources';
import { StructuresView, StructuresViewRelations } from '../models';

export class StructuresViewRepository extends DefaultCrudRepository<
  StructuresView,
  typeof StructuresView.prototype.idStructure,
  StructuresViewRelations
  > {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(StructuresView, dataSource);
  }
}
