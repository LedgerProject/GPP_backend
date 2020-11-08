// Loopback imports
import { Entity, model, property } from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: { schema: 'public', table: 'countriesTopicsLanguages' }
  }
})
export class CountryTopicLanguage extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idCountryTopicLanguage', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idCountryTopicLanguage: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'idCountryTopic', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idCountryTopic: string;

  @property({
    type: 'string',
    required: true,
    length: 100,
    postgresql: { columnName: 'topic', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  topic: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'description', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  description: string;

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

  constructor(data?: Partial<CountryTopicLanguage>) {
    super(data);
  }
}

export interface CountryTopicLanguageRelations {
  // describe navigational properties here
}

export type CountryTopicLanguageWithRelations = CountryTopicLanguage & CountryTopicLanguageRelations;
