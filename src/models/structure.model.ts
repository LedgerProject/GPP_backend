// Loopback imports
import { belongsTo, Entity, hasMany, hasOne, model, property } from '@loopback/repository';
//GPP imports
import { Icon } from './icon.model';
import { StructureCategory } from './structure-category.model';
import { StructureImage } from './structure-image.model';
import { StructureLanguage } from './structure-language.model';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'structures' } }
})
export class Structure extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idStructure', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idStructure: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'idOrganization', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idOrganization: string;

  @property({
    type: 'string',
    required: true,
    length: 100,
    postgresql: { columnName: 'alias', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  alias: string;

  @property({
    type: 'string',
    required: true,
    length: 100,
    postgresql: { columnName: 'name', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    length: 150,
    postgresql: { columnName: 'address', dataType: 'character varying', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  address: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: { columnName: 'city', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  city: string;

  @property({
    type: 'number',
    required: true,
    precision: 53,
    postgresql: { columnName: 'latitude', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'NO' },
  })
  latitude: number;

  @property({
    type: 'number',
    required: true,
    precision: 53,
    postgresql: { columnName: 'longitude', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'NO' },
  })
  longitude: number;

  @property({
    type: 'string',
    length: 150,
    postgresql: { columnName: 'email', dataType: 'character varying', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  email?: string;

  @property({
    type: 'string',
    length: 3,
    postgresql: { columnName: 'phoneNumberPrefix', dataType: 'character varying', dataLength: 10, dataPrecision: null, dataScale: null, nullable: 'YES' },
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

  @belongsTo(() => Icon, {name : 'icon_join'}, {
    type: 'string',
    postgresql: {columnName: 'idIcon', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'
  }})
  idIcon: string;

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

  @hasMany(() => StructureCategory, {keyTo: 'idStructure'})
  structureCategory?: StructureCategory[];

  @hasMany(() => StructureImage, {keyTo: 'idStructure'})
  structureImage?: StructureImage[];

  @hasMany(() => StructureLanguage, {keyTo: 'idStructure'})
  structureLanguage?: StructureLanguage[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Structure>) {
    super(data);
  }
}

export interface StructureRelations {
  // describe navigational properties here
}

export type StructureWithRelations = Structure & StructureRelations;
