// Loopback imports
import {DefaultCrudRepository} from '@loopback/repository';
// GPP imports
import {StructureLanguage, StructureLanguageRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class StructureLanguageRepository extends DefaultCrudRepository<
  StructureLanguage,
  typeof StructureLanguage.prototype.idStructureLanguage,
  StructureLanguageRelations
> {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(StructureLanguage, dataSource);
  }
}
