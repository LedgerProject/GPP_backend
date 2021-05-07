// Loopback imports
import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
// GPP imports
import {GppDataSource} from '../datasources';
import {Nationality, NationalityLanguage, NationalityRelations} from '../models';
import { NationalityLanguageRepository } from './nationality-language.repository';

export class NationalityRepository extends DefaultCrudRepository
  <Nationality, typeof Nationality.prototype.idNationality, NationalityRelations> {
  public readonly nationalityLanguage: HasManyRepositoryFactory<NationalityLanguage, typeof Nationality.prototype.idNationality>;
  
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('NationalityLanguageRepository') nationalityLanguageRepositoryGetter: Getter<NationalityLanguageRepository>,
  ) {
    super(Nationality, dataSource);
    this.nationalityLanguage = this.createHasManyRepositoryFactoryFor('nationalityLanguage', nationalityLanguageRepositoryGetter);

    this.registerInclusionResolver('nationalityLanguage', this.nationalityLanguage.inclusionResolver);
  }
}
