// Loopback imports
import { Entity, model, property } from '@loopback/repository';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'structuresCategories' } }
})
export class StructureCategory extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idStructureCategory', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idStructureCategory: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'idStructure', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idStructure: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'idCategory', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idCategory: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<StructureCategory>) {
    super(data);
  }
}

export interface StructureCategoryRelations {
  // describe navigational properties here
}

export type StructureCategoryWithRelations = StructureCategory & StructureCategoryRelations;
