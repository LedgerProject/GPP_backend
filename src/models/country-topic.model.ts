// Loopback imports
import { belongsTo, Entity, hasMany, model, property } from '@loopback/repository';
// GPP imports
import { Country } from './country.model';
import { CountryTopicLanguage } from './country-topic-language.model';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'countriesTopics' } }
})
export class CountryTopic extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idCountryTopic', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idCountryTopic: string;

  @belongsTo(() => Country, {name : 'country_join'}, {
    type: 'string',
    required: true,
    postgresql: {columnName: 'idCountry', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'
  }})
  idCountry: string;

  @property({
    type: 'string',
    required: true,
    length: 100,
    postgresql: { columnName: 'identifier', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  identifier: string;

  @hasMany(() => CountryTopicLanguage, {keyTo: 'idCountryTopic'})
  countryTopicLanguage?: CountryTopicLanguage[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<CountryTopic>) {
    super(data);
  }
}

export interface CountryTopicRelations {
  // describe navigational properties here
}

export type CountryTopicWithRelations = CountryTopic & CountryTopicRelations;
