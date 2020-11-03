// Loopback imports
import { Entity, model, property } from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: { schema: 'public', table: 'organizationsUsersView' }
  }
})
export class OrganizationsUsersView extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idOrganizationUser', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  idOrganizationUser?: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'idOrganization', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  idOrganization?: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'idUser', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  idUser?: string;

  @property({
    type: 'string',
    length: 100,
    postgresql: { columnName: 'name', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  name?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: { columnName: 'firstName', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  firstName?: string;

  @property({
    type: 'string',
    length: 50,
    postgresql: { columnName: 'lastName', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  lastName?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<OrganizationsUsersView>) {
    super(data);
  }
}

export interface OrganizationsUsersViewRelations {
  // describe navigational properties here
}

export type OrganizationsUsersViewWithRelations = OrganizationsUsersView & OrganizationsUsersViewRelations;
