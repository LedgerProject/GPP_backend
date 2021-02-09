// Loopback imports
import { Entity, hasOne, model, property } from '@loopback/repository';
//GPP imports
import { Structure } from './structure.model';

@model({ settings: { idInjection: false, postgresql: { schema: 'public', table: 'icons' } } })
export class Icon extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idIcon', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idIcon: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'name', dataType: 'text', dataLength: 30, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'image', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  image: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'marker', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  marker: string;

  @hasOne(() => Structure, {keyTo: 'idIcon'})
  structure?: Structure;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Icon>) {
    super(data);
  }
}

export interface IconRelations {
  // describe navigational properties here
}

export type IconWithRelations = Icon & IconRelations;
