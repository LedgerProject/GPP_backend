// Loopback imports
import { Entity, model, property } from '@loopback/repository';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'encryptedChunk' } }
})
export class EncryptedChunk extends Entity {
  @property({
    type: 'number',
    required: true,
    scale: 0,
    id: 1,
    postgresql: { columnName: 'id', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO' },
  })
  id: number;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'idUser', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idUser: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: { columnName: 'name', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  name: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: { columnName: 'uploadReferenceId', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  uploadReferenceId?: string;

  @property({
    type: 'string',
    length: 32,
    postgresql: { columnName: 'chunkIndexId', dataType: 'character varying', dataLength: 32, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  chunkIndexId?: string;

  @property({
    type: 'string',
    length: 32,
    postgresql: { columnName: 'checksum', dataType: 'character varying', dataLength: 32, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  checksum?: string;

  @property({
    type: 'string',
    length: 32,
    postgresql: { columnName: 'header', dataType: 'character varying', dataLength: 32, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  header?: string;

  @property({
    type: 'string',
    length: 32,
    postgresql: { columnName: 'iv', dataType: 'character varying', dataLength: 32, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  iv?: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'text', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  text?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<EncryptedChunk>) {
    super(data);
  }
}

export interface EncryptedChunkRelations {
  // describe navigational properties here
}

export type EncryptedChunkWithRelations = EncryptedChunk & EncryptedChunkRelations;
