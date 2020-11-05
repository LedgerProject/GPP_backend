import {DefaultCrudRepository} from '@loopback/repository';
import {Country, CountryRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CountryRepository extends DefaultCrudRepository<
  Country,
  typeof Country.prototype.idCountry,
  CountryRelations
> {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(Country, dataSource);
  }
}
