// Loopback imports
// Loopback imports
import { Entity, hasMany, model, property } from '@loopback/repository';
// GPP imports
import { CountryLanguage } from './country-language.model';
import { CountryTopic } from './country-topic.model';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'countries' } }
})
export class Country extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idCountry', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idCountry: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: { columnName: 'identifier', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  identifier: string;

  @property({
    type: 'boolean',
    postgresql: { columnName: 'completed', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  completed?: boolean;

  @hasMany(() => CountryLanguage, {keyTo: 'idCountry'})
  countryLanguage?: CountryLanguage[];

  @hasMany(() => CountryTopic, {keyTo: 'idCountry'})
  countryTopic?: CountryTopic[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Country>) {
    super(data);
  }
}

export interface CountryRelations {
  // describe navigational properties here
}

export type CountryWithRelations = Country & CountryRelations;
