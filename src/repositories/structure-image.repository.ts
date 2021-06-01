// Loopback imports
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
//GPP imports
import { GppDataSource } from '../datasources';
import { StructureImage, StructureImageRelations, Structure } from '../models';
import { StructureRepository } from './structure.repository';

export class StructureImageRepository extends DefaultCrudRepository
  <StructureImage, typeof StructureImage.prototype.idStructureImage, StructureImageRelations> {
  public readonly structure: BelongsToAccessor<Structure, typeof StructureImage.prototype.idStructure>;

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('StructureRepository') protected structureRepositoryGetter: Getter<StructureRepository>,
  ) {
    super(StructureImage, dataSource);
    this.structure = this.createBelongsToAccessorFor('structure_join', structureRepositoryGetter);
  }
}
