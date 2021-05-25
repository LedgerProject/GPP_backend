import {DefaultCrudRepository} from '@loopback/repository';
import {ContentMediaEncryptedChunk, ContentMediaEncryptedChunkRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ContentMediaEncryptedChunksRepository extends DefaultCrudRepository
  <ContentMediaEncryptedChunk, typeof ContentMediaEncryptedChunk.prototype.idContentMediaEncryptedChunk, ContentMediaEncryptedChunkRelations> {

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(ContentMediaEncryptedChunk, dataSource);
  }
}
