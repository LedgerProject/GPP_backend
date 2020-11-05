import {DefaultCrudRepository} from '@loopback/repository';
import {CountryLanguage, CountryLanguageRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CountryLanguageRepository extends DefaultCrudRepository<
  CountryLanguage,
  typeof CountryLanguage.prototype.idCountryLanguage,
  CountryLanguageRelations
> {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(CountryLanguage, dataSource);
  }
}
