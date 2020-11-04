import {DefaultCrudRepository} from '@loopback/repository';
import {StructureImage, StructureImageRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class StructureImageRepository extends DefaultCrudRepository<
  StructureImage,
  typeof StructureImage.prototype.idStructureImage,
  StructureImageRelations
> {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(StructureImage, dataSource);
  }
}
