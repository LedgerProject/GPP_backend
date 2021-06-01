import {DefaultCrudRepository} from '@loopback/repository';
import {Content, ContentRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ContentRepository extends DefaultCrudRepository
  <Content, typeof Content.prototype.idContent, ContentRelations> {

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(Content, dataSource);
  }
}
