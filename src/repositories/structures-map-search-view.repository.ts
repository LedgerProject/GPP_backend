import {DefaultCrudRepository} from '@loopback/repository';
import {StructuresMapSearchView, StructuresMapSearchViewRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class StructuresMapSearchViewRepository extends DefaultCrudRepository<
  StructuresMapSearchView,
  typeof StructuresMapSearchView.prototype.idStructureCategory,
  StructuresMapSearchViewRelations
> {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(StructuresMapSearchView, dataSource);
  }
}
