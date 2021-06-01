import {DefaultCrudRepository} from '@loopback/repository';
import {DocumentEncryptedChunk, DocumentEncryptedChunkRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DocumentEncryptedChunksRepository extends DefaultCrudRepository
  <DocumentEncryptedChunk, typeof DocumentEncryptedChunk.prototype.idDocumentEncryptedChunk, DocumentEncryptedChunkRelations> {

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(DocumentEncryptedChunk, dataSource);
  }
}
