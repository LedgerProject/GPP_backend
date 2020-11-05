import {DefaultCrudRepository} from '@loopback/repository';
import {StructuresCategoriesView, StructuresCategoriesViewRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class StructuresCategoriesViewRepository extends DefaultCrudRepository<
  StructuresCategoriesView,
  typeof StructuresCategoriesView.prototype.idStructureCategory,
  StructuresCategoriesViewRelations
> {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(StructuresCategoriesView, dataSource);
  }
}
