import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { GppDataSource } from '../datasources';
import { Structure, StructureRelations } from '../models';

export class StructureRepository extends DefaultCrudRepository<
  Structure,
  typeof Structure.prototype.idStructure,
  StructureRelations
  > {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(Structure, dataSource);
  }
}
