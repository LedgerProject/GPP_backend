// Loopback imports
import { Entity, hasMany, model, property } from '@loopback/repository';
// GPP imports
import { OrganizationUser } from './organization-user.model';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'organizations' } }
})
export class Organization extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idOrganization', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idOrganization: string;

  @property({
    type: 'string',
    required: true,
    length: 100,
    postgresql: { columnName: 'name', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  name: string;

  @hasMany(() => OrganizationUser, {keyTo: 'idOrganization'})
  organizationUser?: OrganizationUser[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Organization>) {
    super(data);
  }
}

export interface OrganizationRelations {
  // describe navigational properties here
}

export type OrganizationWithRelations = Organization & OrganizationRelations;
