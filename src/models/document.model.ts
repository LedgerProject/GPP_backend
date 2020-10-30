import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, postgresql: {schema: 'public', table: 'documents'}}
})
export class Document extends Entity {
  @property({
    type: 'string',
    required: true,
    id: 1,
    postgresql: {columnName: 'idDocument', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  idDocument: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'idUser', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  idUser: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: {columnName: 'title', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  title: string;

  @property({
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {columnName: 'bytes', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO'},
  })
  bytes: number;

  @property({
    type: 'number',
    scale: 0,
    postgresql: {columnName: 'widthPixel', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES'},
  })
  widthPixel?: number;

  @property({
    type: 'number',
    scale: 0,
    postgresql: {columnName: 'heightPixel', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES'},
  })
  heightPixel?: number;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: {columnName: 'fileFolder', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  fileFolder: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: {columnName: 'imageFolder', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  imageFolder: string;

  @property({
    type: 'string',
    required: true,
    length: 5,
    postgresql: {columnName: 'extension', dataType: 'character varying', dataLength: 5, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  extension: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Document>) {
    super(data);
  }
}

export interface DocumentRelations {
  // describe navigational properties here
}

export type DocumentWithRelations = Document & DocumentRelations;
