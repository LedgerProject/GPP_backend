// Loopback imports
import { Getter, inject } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
// GPP imports
import { GppDataSource } from '../datasources';
import { Category, CategoryLanguage, CategoryRelations, StructureCategory } from '../models';
import { CategoryLanguageRepository } from './category-language.repository';
import { StructureCategoryRepository } from './structure-category.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.idCategory,
  CategoryRelations
> {
  public readonly structureCategory: HasManyRepositoryFactory<
  StructureCategory,
  typeof Category.prototype.idCategory
  >;
  public readonly categoryLanguage: HasManyRepositoryFactory<
  CategoryLanguage,
  typeof Category.prototype.idCategory
  >;
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('StructureCategoryRepository')
    structureCategoryRepositoryGetter: Getter<StructureCategoryRepository>,
    @repository.getter('CategoryLanguageRepository')
    categoryLanguageRepositoryGetter: Getter<CategoryLanguageRepository>,
  ) {
    super(Category, dataSource);
    this.structureCategory = this.createHasManyRepositoryFactoryFor('structureCategory', structureCategoryRepositoryGetter);
    this.categoryLanguage = this.createHasManyRepositoryFactoryFor('categoryLanguage', categoryLanguageRepositoryGetter);

    this.registerInclusionResolver('structureCategory', this.structureCategory.inclusionResolver);
    this.registerInclusionResolver('categoryLanguage', this.categoryLanguage.inclusionResolver);
  }
}
