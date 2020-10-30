import { Entity, model, property } from '@loopback/repository';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'categoriesLanguages' } }
})
export class CategoryLanguage extends Entity {
  @property({
    type: 'string',
    required: true,
    id: 1,
    postgresql: { columnName: 'idCategoryLanguage', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idCategoryLanguage: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'idCategory', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idCategory: string;

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
    postgresql: { columnName: 'category', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  category: string;

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

  constructor(data?: Partial<CategoryLanguage>) {
    super(data);
  }
}

export interface CategoryLanguageRelations {
  // describe navigational properties here
}

export type CategoryLanguageWithRelations = CategoryLanguage & CategoryLanguageRelations;
