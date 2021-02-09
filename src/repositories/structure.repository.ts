// Loopback imports
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
// GPP imports
import { GppDataSource } from '../datasources';
import { Structure, StructureRelations, Icon } from '../models';
import { IconRepository } from './icon.repository';

export class StructureRepository extends DefaultCrudRepository<
  Structure,
  typeof Structure.prototype.idStructure,
  StructureRelations
  > {
  public readonly icon: BelongsToAccessor<
  Icon,
  typeof Structure.prototype.idIcon
  >;
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('IconRepository')
    protected iconRepositoryGetter: Getter<IconRepository>,
  ) {
    super(Structure, dataSource);
    this.icon = this.createBelongsToAccessorFor('icon', iconRepositoryGetter);

    this.registerInclusionResolver('icon', this.icon.inclusionResolver);
  }
}
