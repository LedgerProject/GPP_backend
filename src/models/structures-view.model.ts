// Loopback imports
import { Entity, hasMany, model, property } from '@loopback/repository';
//GPP imports
import { StructuresCategoriesView } from './structures-categories-view.model';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'structuresView' } }
})
export class StructuresView extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idStructure', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  idStructure?: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'idOrganization', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  idOrganization?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: { columnName: 'organizationname', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  organizationname?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: { columnName: 'alias', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  alias?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: { columnName: 'structurename', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  structurename?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: { columnName: 'address', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  address?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: { columnName: 'city', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  city?: string;

  @property({
    type: 'number',
    precision: 53,
    postgresql: { columnName: 'latitude', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES' },
  })
  latitude?: number;

  @property({
    type: 'number',
    precision: 53,
    postgresql: { columnName: 'longitude', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'YES' },
  })
  longitude?: number;

  @property({
    type: 'string',
    length: 150,
    postgresql: { columnName: 'email', dataType: 'character varying', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  email?: string;

  @property({
    type: 'string',
    length: 3,
    postgresql: { columnName: 'phoneNumberPrefix', dataType: 'character', dataLength: 3, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  phoneNumberPrefix?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: { columnName: 'phoneNumber', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  phoneNumber?: string;

  @property({
    type: 'string',
    length: 150,
    postgresql: { columnName: 'website', dataType: 'character varying', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  website?: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'idIcon', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  idIcon?: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'iconimage', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  iconimage?: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'iconmarker', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  iconmarker?: string;

  @property({
    type: 'string',
    length: 30,
    postgresql: {columnName: 'publicationStatus', dataType: 'character varying', dataLength: 30, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  publicationStatus?: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'rejectionDescription', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  rejectionDescription?: string;

  @property({
    type: 'number',
    required: false
  })
  distance?: number;

  @hasMany(() => StructuresCategoriesView, {keyTo: 'idStructure'})
  structuresCategoriesView?: StructuresCategoriesView[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<StructuresView>) {
    super(data);
  }
}

export interface StructuresViewRelations {
  // describe navigational properties here
}

export type StructuresViewWithRelations = StructuresView & StructuresViewRelations;
