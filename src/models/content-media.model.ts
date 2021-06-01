// Loopback imports
import { Entity, model, property } from '@loopback/repository';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'contentsMedia' } }
})
export class ContentMedia extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idContentMedia', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idContentMedia: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'idContent', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idContent: string;

  @property({
    type: 'string',
    required: true,
    length: 100,
    postgresql: { columnName: 'filename', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  filename: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'mimeType', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  mimeType?: string;

  @property({
    type: 'number',
    scale: 0,
    postgresql: { columnName: 'size', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO' },
  })
  size: number;

  @property({
    type: 'number',
    scale: 0,
    postgresql: { columnName: 'widthPixel', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES' },
  })
  widthPixel?: number;

  @property({
    type: 'number',
    scale: 0,
    postgresql: { columnName: 'heightPixel', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES' },
  })
  heightPixel?: number;

  @property({
    type: 'string',
    required: true,
    length: 10,
    postgresql: {columnName: 'key', dataType: 'character varying', dataLength: 10, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  key: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ContentMedia>) {
    super(data);
  }
}

export interface ContentMediaRelations {
  // describe navigational properties here
}

export type ContentsMediaWithRelations = ContentMedia & ContentMediaRelations;
