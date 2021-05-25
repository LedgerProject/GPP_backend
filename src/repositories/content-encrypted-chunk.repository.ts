import {DefaultCrudRepository} from '@loopback/repository';
import {ContentEncryptedChunk, ContentEncryptedChunkRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ContentEncryptedChunksRepository extends DefaultCrudRepository
  <ContentEncryptedChunk, typeof ContentEncryptedChunk.prototype.idContentEncryptedChunk, ContentEncryptedChunkRelations> {

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(ContentEncryptedChunk, dataSource);
  }
}
