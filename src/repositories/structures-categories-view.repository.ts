// Loopback imports
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
//GPP imports
import { StructuresCategoriesView, StructuresCategoriesViewRelations, StructuresView } from '../models';
import { GppDataSource } from '../datasources';
import { StructuresViewRepository } from './structures-view.repository';

export class StructuresCategoriesViewRepository extends DefaultCrudRepository<
  StructuresCategoriesView,
  typeof StructuresCategoriesView.prototype.idStructureCategory,
  StructuresCategoriesViewRelations
  > {
  public readonly structuresView: BelongsToAccessor<
    StructuresView,
    typeof StructuresCategoriesView.prototype.idStructure
  >;
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('StructuresViewRepository')
    protected structuresViewRepositoryGetter: Getter<StructuresViewRepository>,
  ) {
    super(StructuresCategoriesView, dataSource);
    this.structuresView = this.createBelongsToAccessorFor('structuresView_join', structuresViewRepositoryGetter);
  }
}
