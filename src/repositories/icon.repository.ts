import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { GppDataSource } from '../datasources';
import { Icon, IconRelations } from '../models';

export class IconRepository extends DefaultCrudRepository<
  Icon,
  typeof Icon.prototype.idIcon,
  IconRelations
  > {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(Icon, dataSource);
  }
}
