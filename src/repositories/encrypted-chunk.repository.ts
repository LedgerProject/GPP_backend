import {DefaultCrudRepository} from '@loopback/repository';
import {EncryptedChunk, EncryptedChunkRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class EncryptedChunkRepository extends DefaultCrudRepository<
  EncryptedChunk,
  typeof EncryptedChunk.prototype.id,
  EncryptedChunkRelations
> {
  constructor(
    @inject('datasources.Gpp') dataSource: GppDataSource,
  ) {
    super(EncryptedChunk, dataSource);
  }
}
