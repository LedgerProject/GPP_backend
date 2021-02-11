// Loopback imports
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
//GPP imports
import { GppDataSource } from '../datasources';
import { Category, CategoryLanguage, CategoryLanguageRelations } from '../models';
import { CategoryRepository } from './category.repository';

export class CategoryLanguageRepository extends DefaultCrudRepository<
  CategoryLanguage,
  typeof CategoryLanguage.prototype.idCategoryLanguage,
  CategoryLanguageRelations
  > {
  public readonly category: BelongsToAccessor<
  Category,
  typeof CategoryLanguage.prototype.idCategory
  >;
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('CategoryRepository')
    protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(CategoryLanguage, dataSource);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter);
  }
}
