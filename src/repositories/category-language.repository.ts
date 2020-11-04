import {DefaultCrudRepository} from '@loopback/repository';
import {CategoryLanguage, CategoryLanguageRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CategoryLanguageRepository extends DefaultCrudRepository<
  CategoryLanguage,
  typeof CategoryLanguage.prototype.idCategoryLanguage,
  CategoryLanguageRelations
> {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(CategoryLanguage, dataSource);
  }
}
