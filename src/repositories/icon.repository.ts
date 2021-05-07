// Loopback imports
import { Getter, inject } from '@loopback/core';
import { DefaultCrudRepository, HasOneRepositoryFactory, repository } from '@loopback/repository';
// GPP imports
import { GppDataSource } from '../datasources';
import { Icon, IconRelations, Structure } from '../models';
import { StructureRepository } from './structure.repository';

export class IconRepository extends DefaultCrudRepository
  <Icon, typeof Icon.prototype.idIcon, IconRelations> {
  public readonly structure: HasOneRepositoryFactory<Structure, typeof Icon.prototype.idIcon>;

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('StructureRepository') structureRepositoryGetter: Getter<StructureRepository>,
  ) {
    super(Icon, dataSource);
    this.structure = this.createHasOneRepositoryFactoryFor('structure', structureRepositoryGetter);

    this.registerInclusionResolver('structure', this.structure.inclusionResolver);
  }
}
