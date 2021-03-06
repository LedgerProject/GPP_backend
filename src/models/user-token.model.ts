// Loopback imports
import { Entity, model, property } from '@loopback/repository';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'usersTokens' } }
})
export class UserToken extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idUserToken', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idUserToken: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'idUser', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idUser: string;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'token', dataType: 'character varying', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  token: string;

  @property({
    type: 'date',
    required: true,
    postgresql: { columnName: 'validUntil', dataType: 'timestamp without time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  validUntil: number;

  @property({
    type: 'string',
    postgresql: { columnName: 'key', dataType: 'character varying', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  key: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'checksum', dataType: 'character varying', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  checksum: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'header', dataType: 'character varying', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  header: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'iv', dataType: 'character varying', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  iv: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserToken>) {
    super(data);
  }
}

export interface UserTokenRelations {
  // describe navigational properties here
}

export type UserTokenWithRelations = UserToken & UserTokenRelations;
