// Loopback imports
import { Entity, hasMany, model, property } from '@loopback/repository';
// GPP imports
import { StructureCategory } from './structure-category.model';
import { CategoryLanguage } from './category-language.model';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'categories' } }
})
export class Category extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idCategory', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idCategory: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: { columnName: 'identifier', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  identifier: string;

  @property({
    type: 'string',
    required: true,
    length: 20,
    postgresql: { columnName: 'type', dataType: 'character varying', dataLength: 20, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  type: string;

  @hasMany(() => StructureCategory, {keyTo: 'idCategory'})
  structureCategory?: StructureCategory[];

  @hasMany(() => CategoryLanguage, {keyTo: 'idCategory'})
  categoryLanguage?: CategoryLanguage[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
