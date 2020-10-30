import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, postgresql: {schema: 'public', table: 'nationalities'}}
})
export class Nationality extends Entity {
  @property({
    type: 'string',
    required: true,
    id: 1,
    postgresql: {columnName: 'idNationality', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  idNationality: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: {columnName: 'identifier', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  identifier: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Nationality>) {
    super(data);
  }
}

export interface NationalityRelations {
  // describe navigational properties here
}

export type NationalityWithRelations = Nationality & NationalityRelations;
