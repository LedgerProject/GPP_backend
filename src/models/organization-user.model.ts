//Loopback imports
import { belongsTo, Entity, model, property } from '@loopback/repository';
//GPP imports
import { Organization } from './organization.model';
import { User } from './user.model';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'organizationsUsers' } }
})
export class OrganizationUser extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idOrganizationUser', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idOrganizationUser: string;

  @belongsTo(() => Organization, {name : 'organization_join'}, {
    type: 'string',
    required: true,
    postgresql: {columnName: 'idOrganization', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'
  }})
  idOrganization: string;

  @belongsTo(() => User, {name : 'user_join'}, {
    type: 'string',
    required: true,
    postgresql: {columnName: 'idUser', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'
  }})
  idUser: string;

  @property.array(String)
  permissions: String[]

  @property({
    type: 'boolean',
    required: true,
    postgresql: { columnName: 'confirmed', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  confirmed: boolean;

  @property({
    type: 'string',
    postgresql: { columnName: 'invitationToken', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  invitationToken: string;

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
