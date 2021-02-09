// Loopback imports
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
//GPP imports
import { GppDataSource } from '../datasources';
import { StructureCategory, StructureCategoryRelations, Structure, Category } from '../models';
import { CategoryRepository } from './category.repository';
import { StructureRepository } from './structure.repository';

export class StructureCategoryRepository extends DefaultCrudRepository<
  StructureCategory,
  typeof StructureCategory.prototype.idStructureCategory,
  StructureCategoryRelations
  > {
  public readonly structure: BelongsToAccessor<
  Structure,
  typeof StructureCategory.prototype.idStructure
  >;
  public readonly category: BelongsToAccessor<
  Category,
  typeof StructureCategory.prototype.idCategory
  >;
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('StructureRepository')
    protected structureRepositoryGetter: Getter<StructureRepository>,
    @repository.getter('CategoryRepository')
    protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(StructureCategory, dataSource);
    this.structure = this.createBelongsToAccessorFor('structure', structureRepositoryGetter);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter);

    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
