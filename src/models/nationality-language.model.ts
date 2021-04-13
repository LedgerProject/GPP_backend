// Loopback imports
import { belongsTo, Entity, model, property } from '@loopback/repository';
import { Nationality } from './nationality.model';

@model({
  settings: {
    idInjection: false,
    postgresql: { schema: 'public', table: 'nationalitiesLanguages' }
  }
})
export class NationalityLanguage extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idNationalityLanguage', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idNationalityLanguage: string;

  @belongsTo(() => Nationality, {name : 'nationality_join'}, {
    type: 'string',
    required: true,
    postgresql: {columnName: 'idNationality', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'
  }})
  idNationality: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: { columnName: 'alias', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  alias: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: { columnName: 'nationality', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  nationality: string;

  @property({
    type: 'string',
    required: true,
    length: 2,
    postgresql: { columnName: 'language', dataType: 'character', dataLength: 2, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  language: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<NationalityLanguage>) {
    super(data);
  }
}

export interface NationalityLanguageRelations {
  // describe navigational properties here
}

export type NationalityLanguageWithRelations = NationalityLanguage & NationalityLanguageRelations;
