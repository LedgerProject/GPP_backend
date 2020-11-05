import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'structuresCategoriesView'}
  }
})
export class StructuresCategoriesView extends Entity {
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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<StructuresCategoriesView>) {
    super(data);
  }
}

export interface StructuresCategoriesViewRelations {
  // describe navigational properties here
}

export type StructuresCategoriesViewWithRelations = StructuresCategoriesView & StructuresCategoriesViewRelations;
