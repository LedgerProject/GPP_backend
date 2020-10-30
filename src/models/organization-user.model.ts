import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, postgresql: {schema: 'public', table: 'organizationsUsers'}}
})
export class OrganizationUser extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: {columnName: 'idOrganizationUser', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  idOrganizationUser: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'idOrganization', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  idOrganization: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {columnName: 'idUser', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  idUser: string;

  @property({
    type: 'string',
    required: true,
    length: 100,
    postgresql: {columnName: 'accessLevel', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  accessLevel: string;

  @property({
    type: 'boolean',
    required: true,
    postgresql: {columnName: 'confirmed', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  confirmed: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<OrganizationUser>) {
    super(data);
  }
}

export interface OrganizationUserRelations {
  // describe navigational properties here
}

export type OrganizationUserWithRelations = OrganizationUser & OrganizationUserRelations;
