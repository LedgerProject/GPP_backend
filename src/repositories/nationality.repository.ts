import {DefaultCrudRepository} from '@loopback/repository';
import {Nationality, NationalityRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class NationalityRepository extends DefaultCrudRepository<
  Nationality,
  typeof Nationality.prototype.idNationality,
  NationalityRelations
> {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(Nationality, dataSource);
  }
}
