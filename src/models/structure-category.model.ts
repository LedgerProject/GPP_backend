// Loopback imports
import { belongsTo, Entity, model, property } from '@loopback/repository';
import { Category } from './category.model';
//GPP imports
import { Structure } from './structure.model';

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

  @belongsTo(() => Structure, {name : 'structure_join'}, {
    type: 'string',
    required: true,
    postgresql: {columnName: 'idStructure', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'
  }})
  idStructure: string;

  @belongsTo(() => Category, {name : 'category_join'}, {
    type: 'string',
    required: true,
    postgresql: {columnName: 'idCategory', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'
  }})
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
