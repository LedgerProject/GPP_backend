// Loopback imports
import { Getter, inject } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
// GPP imports
import { GppDataSource } from '../datasources';
import { StructuresCategoriesView, StructuresView, StructuresViewRelations } from '../models';
import { StructuresCategoriesViewRepository } from './structures-categories-view.repository';

export class StructuresViewRepository extends DefaultCrudRepository<
  StructuresView,
  typeof StructuresView.prototype.idStructure,
  StructuresViewRelations
  >
  {
  public readonly structuresCategoriesView: HasManyRepositoryFactory<
    StructuresCategoriesView,
    typeof StructuresView.prototype.idStructure
  >;
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('StructuresCategoriesViewRepository')
    structuresCategoriesViewRepositoryGetter: Getter<StructuresCategoriesViewRepository>,
  ) {
    super(StructuresView, dataSource);
    this.structuresCategoriesView = this.createHasManyRepositoryFactoryFor('structuresCategoriesView', structuresCategoriesViewRepositoryGetter);

    this.registerInclusionResolver('structuresCategoriesView', this.structuresCategoriesView.inclusionResolver);
  }
}
