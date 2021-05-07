// Loopback imports
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
// GPP imports
import { GppDataSource } from '../datasources';
import { Country, CountryTopic, CountryTopicLanguage, CountryTopicRelations } from '../models';
import { CountryTopicLanguageRepository } from './country-topic-language.repository';
import { CountryRepository } from './country.repository';

export class CountryTopicRepository extends DefaultCrudRepository
  <CountryTopic, typeof CountryTopic.prototype.idCountryTopic, CountryTopicRelations> {
  public readonly country: BelongsToAccessor<Country, typeof CountryTopic.prototype.idCountry>;
  public readonly countryTopicLanguage: HasManyRepositoryFactory<CountryTopicLanguage, typeof CountryTopic.prototype.idCountryTopic>;

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('CountryRepository') protected countryRepositoryGetter: Getter<CountryRepository>,
    @repository.getter('CountryTopicLanguageRepository') countryTopicLanguageRepositoryGetter: Getter<CountryTopicLanguageRepository>,
  ) {
    super(CountryTopic, dataSource);
    this.country = this.createBelongsToAccessorFor('country_join', countryRepositoryGetter);
    this.countryTopicLanguage = this.createHasManyRepositoryFactoryFor('countryTopicLanguage', countryTopicLanguageRepositoryGetter);

    this.registerInclusionResolver('countryTopicLanguage', this.countryTopicLanguage.inclusionResolver);
  }
}
