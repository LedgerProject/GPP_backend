import {DefaultCrudRepository} from '@loopback/repository';
import {CountryTopic, CountryTopicRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CountryTopicRepository extends DefaultCrudRepository<
  CountryTopic,
  typeof CountryTopic.prototype.idCountryTopic,
  CountryTopicRelations
> {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(CountryTopic, dataSource);
  }
}
