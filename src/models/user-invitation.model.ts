// Loopback imports
import { Entity, model, property } from '@loopback/repository';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'usersInvitations' } }
})
export class UserInvitation extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idUserInvitation', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idUserInvitation: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'idUserSender', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idUserSender: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'idUserRecipient', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idUserRecipient: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'message', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  message?: string;

  @property({
    type: 'string',
    required: true,
    length: 100,
    postgresql: { columnName: 'accessLevel', dataType: 'character varying', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  accessLevel: string;

  @property({
    type: 'boolean',
    required: true,
    postgresql: { columnName: 'accepted', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  accepted: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserInvitation>) {
    super(data);
  }
}

export interface UserInvitationRelations {
  // describe navigational properties here
}

export type UserInvitationWithRelations = UserInvitation & UserInvitationRelations;
