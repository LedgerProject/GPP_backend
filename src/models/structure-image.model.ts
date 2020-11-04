// Loopback imports
import { Entity, model, property } from '@loopback/repository';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'structuresImages' } }
})
export class StructureImage extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idStructureImage', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idStructureImage: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'idStructure', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idStructure: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'image', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  image: string;

  @property({
    type: 'number',
    required: true,
    scale: 0,
    postgresql: { columnName: 'sorting', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO' },
  })
  sorting: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<StructureImage>) {
    super(data);
  }
}

export interface StructureImageRelations {
  // describe navigational properties here
}

export type StructureImageWithRelations = StructureImage & StructureImageRelations;
