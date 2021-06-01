import {DefaultCrudRepository} from '@loopback/repository';
import {ContentMedia, ContentMediaRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ContentMediaRepository extends DefaultCrudRepository
  <ContentMedia, typeof ContentMedia.prototype.idContentMedia, ContentMediaRelations> {

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(ContentMedia, dataSource);
  }
}
