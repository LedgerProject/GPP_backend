// Loopback imports
import { belongsTo, Entity, model, property } from '@loopback/repository';
import { Country } from './country.model';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'countriesLanguages' } }
})
export class CountryLanguage extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idCountryLanguage', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idCountryLanguage: string;

  @belongsTo(() => Country, {name : 'country'}, {
    type: 'string',
    required: true,
    postgresql: {columnName: 'idCountry', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'
  }})
  idCountry: string;

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
    postgresql: { columnName: 'country', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  country: string;

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

  constructor(data?: Partial<CountryLanguage>) {
    super(data);
  }
}

export interface CountryLanguageRelations {
  // describe navigational properties here
}

export type CountryLanguageWithRelations = CountryLanguage & CountryLanguageRelations;
