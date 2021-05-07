// Loopback imports
import { Getter, inject } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
// GPP imports
import { GppDataSource } from '../datasources';
import { Country, CountryLanguage, CountryRelations, CountryTopic } from '../models';
import { CountryLanguageRepository } from './country-language.repository';
import { CountryTopicRepository } from './country-topic.repository';

export class CountryRepository extends DefaultCrudRepository
  <Country, typeof Country.prototype.idCountry, CountryRelations> {
  public readonly countryLanguage: HasManyRepositoryFactory<CountryLanguage, typeof Country.prototype.idCountry>;
  public readonly countryTopic: HasManyRepositoryFactory<CountryTopic, typeof Country.prototype.idCountry>;

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('CountryLanguageRepository') countryLanguageRepositoryGetter: Getter<CountryLanguageRepository>,
    @repository.getter('CountryTopicRepository') countryTopicRepositoryGetter: Getter<CountryTopicRepository>,
  ) {
    super(Country, dataSource);
    this.countryLanguage = this.createHasManyRepositoryFactoryFor('countryLanguage', countryLanguageRepositoryGetter);
    this.countryTopic = this.createHasManyRepositoryFactoryFor('countryTopic', countryTopicRepositoryGetter);

    this.registerInclusionResolver('countryLanguage', this.countryLanguage.inclusionResolver);
    this.registerInclusionResolver('countryTopic', this.countryTopic.inclusionResolver);
  }
}
