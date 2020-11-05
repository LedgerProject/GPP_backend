import {DefaultCrudRepository} from '@loopback/repository';
import {StructureCategory, StructureCategoryRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class StructureCategoryRepository extends DefaultCrudRepository<
  StructureCategory,
  typeof StructureCategory.prototype.idStructureCategory,
  StructureCategoryRelations
> {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(StructureCategory, dataSource);
  }
}
