import {DefaultCrudRepository} from '@loopback/repository';
import {NationalityLanguage, NationalityLanguageRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class NationalityLanguageRepository extends DefaultCrudRepository<
  NationalityLanguage,
  typeof NationalityLanguage.prototype.idNationalityLanguage,
  NationalityLanguageRelations
> {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(NationalityLanguage, dataSource);
  }
}
