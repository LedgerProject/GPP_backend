// Loopback imports
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
// GPP imports
import { GppDataSource } from '../datasources';
import { Country, CountryLanguage, CountryLanguageRelations } from '../models';
import { CountryRepository } from './country.repository';

export class CountryLanguageRepository extends DefaultCrudRepository
  <CountryLanguage, typeof CountryLanguage.prototype.idCountryLanguage, CountryLanguageRelations> {
  public readonly country: BelongsToAccessor<Country, typeof CountryLanguage.prototype.idCountry>;

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('CountryRepository') protected countryRepositoryGetter: Getter<CountryRepository>,
  ) {
    super(CountryLanguage, dataSource);
    this.country = this.createBelongsToAccessorFor('country_join', countryRepositoryGetter);
  }
}
