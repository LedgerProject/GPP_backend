import {DefaultCrudRepository} from '@loopback/repository';
import {CountryTopicLanguage, CountryTopicLanguageRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CountryTopicLanguageRepository extends DefaultCrudRepository<
  CountryTopicLanguage,
  typeof CountryTopicLanguage.prototype.idCountryTopicLanguage,
  CountryTopicLanguageRelations
> {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(CountryTopicLanguage, dataSource);
  }
}
