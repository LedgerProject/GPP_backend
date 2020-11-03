import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { GppDataSource } from '../datasources';
import { EncryptedChunk, EncryptedChunkRelations } from '../models';

export class EncryptedChunkRepository extends DefaultCrudRepository<
  EncryptedChunk,
  typeof EncryptedChunk.prototype.id,
  EncryptedChunkRelations
  > {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(EncryptedChunk, dataSource);
  }
}
