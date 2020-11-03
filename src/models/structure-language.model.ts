// Loopback imports
import { Entity, model, property } from '@loopback/repository';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'structuresLanguages' } }
})
export class StructureLanguage extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idStructureLanguage', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idStructureLanguage: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'idStructure', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idStructure: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'description', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  description?: string;

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

  constructor(data?: Partial<StructureLanguage>) {
    super(data);
  }
}

export interface StructureLanguageRelations {
  // describe navigational properties here
}

export type StructureLanguageWithRelations = StructureLanguage & StructureLanguageRelations;
