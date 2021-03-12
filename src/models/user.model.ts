// Loopback imports
import { Entity, hasMany, model, property } from '@loopback/repository';
// GPP imports
import { OrganizationUser } from './organization-user.model';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'users' } }
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idUser', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idUser?: string;

  @property({
    type: 'string',
    required: true,
    length: 30,
    postgresql: { columnName: 'userType', dataType: 'character varying', dataLength: 30, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  userType: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: { columnName: 'firstName', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: { columnName: 'lastName', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
    length: 150,
    postgresql: { columnName: 'email', dataType: 'character varying', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  email: string;

  @property({
    type: 'boolean',
    postgresql: { columnName: 'emailConfirmed', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  emailConfirmed: boolean;

  @property({
    type: 'string',
    required: true,
    postgresql: { columnName: 'password', dataType: 'character varying', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  password: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'passwordRecoveryToken', dataType: 'character varying', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  passwordRecoveryToken: string;

  @property({
    type: 'date',
    postgresql: { columnName: 'passwordRecoveryDate', dataType: 'timestamp without time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  passwordRecoveryDate: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'idNationality', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  idNationality: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'gender', dataType: 'character varying', dataLength: 10, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  gender: string;

  @property({
    type: 'date',
    postgresql: { columnName: 'birthday', dataType: 'date', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  birthday: string;

  @property({
    type: 'string',
    postgresql: { columnName: 'confirmAccountToken', dataType: 'character varying', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  confirmAccountToken: string;

  @hasMany(() => OrganizationUser, {keyTo: 'idUser'})
  organizationUser?: OrganizationUser[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
