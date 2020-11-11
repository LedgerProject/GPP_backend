import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'documentsEncryptedChunks'}
  }
})
export class DocumentEncryptedChunk extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: {columnName: 'idDocumentEncryptedChunk', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  idDocumentEncryptedChunk: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'idDocument', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  idDocument: string;

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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<DocumentEncryptedChunk>) {
    super(data);
  }
}

export interface DocumentEncryptedChunkRelations {
  // describe navigational properties here
}

export type DocumentsEncryptedChunksWithRelations = DocumentEncryptedChunk & DocumentEncryptedChunkRelations;
