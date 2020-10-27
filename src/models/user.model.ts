import { Entity, model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  iduser?: string;

  @property({
    type: 'string',
    required: true,
  })
  firstname: string;

  @property({
    type: 'string',
    required: true,
  })
  lastname: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'boolean',
  })
  emailconfirmed: boolean;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
  })
  passwordrecoverytoken: string;

  @property({
    type: 'date',
  })
  passwordrecoverydate: string;

  @property.array(String)
  permissions: String[]

  @property({
    type: 'string',
  })
  idnationality: string;

  @property({
    type: 'string',
  })
  gender: string;

  @property({
    type: 'date',
  })
  birthday: string;

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
