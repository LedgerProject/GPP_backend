// Loopback imports
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
// GPP imports
import { GppDataSource } from '../datasources';
import { StructureLanguage, StructureLanguageRelations, Structure } from '../models';
import { StructureRepository } from './structure.repository';

export class StructureLanguageRepository extends DefaultCrudRepository<
  StructureLanguage,
  typeof StructureLanguage.prototype.idStructureLanguage,
  StructureLanguageRelations
> {
  public readonly structure: BelongsToAccessor<
  Structure,
  typeof StructureLanguage.prototype.idStructure
  >;
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('StructureRepository')
    protected structureRepositoryGetter: Getter<StructureRepository>,
  ) {
    super(StructureLanguage, dataSource);
    this.structure = this.createBelongsToAccessorFor('structure', structureRepositoryGetter);
  }
}
