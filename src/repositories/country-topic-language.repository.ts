// Loopback imports
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
// GPP imports
import { GppDataSource } from '../datasources';
import { CountryTopic, CountryTopicLanguage, CountryTopicLanguageRelations } from '../models';
import { CountryTopicRepository } from './country-topic.repository';

export class CountryTopicLanguageRepository extends DefaultCrudRepository<
  CountryTopicLanguage,
  typeof CountryTopicLanguage.prototype.idCountryTopicLanguage,
  CountryTopicLanguageRelations
  > {
  public readonly countryTopic: BelongsToAccessor<
  CountryTopic,
  typeof CountryTopicLanguage.prototype.idCountryTopic
  >;
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('CountryTopicRepository')
    protected countryTopicRepositoryGetter: Getter<CountryTopicRepository>,
  ) {
    super(CountryTopicLanguage, dataSource);
    this.countryTopic = this.createBelongsToAccessorFor('countryTopic', countryTopicRepositoryGetter);
  }
}
