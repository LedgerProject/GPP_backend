// Loopback imports
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
// GPP imports
import { GppDataSource } from '../datasources';
import { Nationality, NationalityLanguage, NationalityLanguageRelations } from '../models';
import { NationalityRepository } from './nationality.repository';

export class NationalityLanguageRepository extends DefaultCrudRepository<
  NationalityLanguage,
  typeof NationalityLanguage.prototype.idNationalityLanguage,
  NationalityLanguageRelations
> {
  public readonly nationality: BelongsToAccessor<
  Nationality,
  typeof NationalityLanguage.prototype.idNationality
  >;
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('NationalityRepository')
    protected nationalityRepositoryGetter: Getter<NationalityRepository>,
  ) {
    super(NationalityLanguage, dataSource);
    this.nationality = this.createBelongsToAccessorFor('nationality', nationalityRepositoryGetter);
  }
}
