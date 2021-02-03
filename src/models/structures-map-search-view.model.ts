import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'structuresMapSearchView'}
  }
})
export class StructuresMapSearchView extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: {columnName: 'idStructureCategory', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  idStructureCategory?: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'idStructure', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  idStructure?: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'idCategory', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  idCategory?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: {columnName: 'identifier', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  identifier?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {columnName: 'structurealias', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  structureAlias?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: {columnName: 'structurename', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  structureName?: string;

  @property({
    type: 'string',
    length: 150,
    postgresql: {columnName: 'structureaddress', dataType: 'character varying', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  structureAddress?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: {columnName: 'structurecity', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  structureCity?: string;

  @property({
    type: 'number',
    length: 53,
    postgresql: {columnName: 'structurelatitude', dataType: 'float', dataLength: 53, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  structureLatitude?: number;

  @property({
    type: 'number',
    length: 53,
    postgresql: {columnName: 'structurelongitude', dataType: 'float', dataLength: 53, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  structureLongitude?: number;

  @property({
    type: 'string',
    postgresql: {columnName: 'structureidicon', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  structureIdIcon?: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'structureimage', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  structureImage?: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'structuremarker', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  structureMarker?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<StructuresMapSearchView>) {
    super(data);
  }
}

export interface StructuresMapSearchViewRelations {
  // describe navigational properties here
}

export type StructuresMapSearchViewWithRelations = StructuresMapSearchView & StructuresMapSearchViewRelations;
