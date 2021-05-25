// Loopback imports
import { Entity, model, property } from '@loopback/repository';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'contents' } }
})
export class Content extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idContent', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idContent: string;

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
    postgresql: { columnName: 'title', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  title: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'description', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  description?: string;

  @property({
    type: 'boolean',
    required: true,
    postgresql: { columnName: 'sharePosition', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  sharePosition: boolean;

  @property({
    type: 'number',
    precision: 53,
    postgresql: { columnName: 'positionLatitude', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES' },
  })
  positionLatitude?: number;

  @property({
    type: 'number',
    precision: 53,
    postgresql: { columnName: 'positionLongitude', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES' },
  })
  positionLongitude?: number;

  @property({
    type: 'boolean',
    required: true,
    postgresql: { columnName: 'shareName', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  shareName: boolean;

  @property({
    type: 'string',
    required: true,
    length: 30,
    postgresql: {columnName: 'contentType', dataType: 'character varying', dataLength: 30, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  contentType: string;

  @property({
    type: 'date',
    required: true,
    postgresql: { columnName: 'insertDate', dataType: 'timestamp without time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  insertDate: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Content>) {
    super(data);
  }
}

export interface ContentRelations {
  // describe navigational properties here
}

export type ContentsWithRelations = Content & ContentRelations;
