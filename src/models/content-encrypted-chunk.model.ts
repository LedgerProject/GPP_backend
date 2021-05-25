import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'contentsEncryptedChunks'}
  }
})
export class ContentEncryptedChunk extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: {columnName: 'idContentEncryptedChunk', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  idContentEncryptedChunk: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'idContent', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  idContent: string;

  @property({
    type: 'number',
    scale: 0,
    postgresql: {columnName: 'chunkIndexId', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES'},
  })
  chunkIndexId?: number;

  @property({
    type: 'string',
    length: 32,
    postgresql: {columnName: 'checksum', dataType: 'character varying', dataLength: 32, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  checksum?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: {columnName: 'header', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  header?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: {columnName: 'iv', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  iv?: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'text', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  text?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: {columnName: 'ipfsPath', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  ipfsPath?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: {columnName: 'transactionId', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  transactionId?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: {columnName: 'status', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  status?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ContentEncryptedChunk>) {
    super(data);
  }
}

export interface ContentEncryptedChunkRelations {
  // describe navigational properties here
}

export type ContentsEncryptedChunksWithRelations = ContentEncryptedChunk & ContentEncryptedChunkRelations;
