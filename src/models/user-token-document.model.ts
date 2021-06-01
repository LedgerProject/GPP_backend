// Loopback imports
import { belongsTo, Entity, model, property } from '@loopback/repository';
//GPP imports
import { UserToken } from './user-token.model';
import { Document } from './document.model';

@model({
  settings: { idInjection: false, postgresql: { schema: 'public', table: 'usersTokensDocuments' } }
})
export class UserTokenDocument extends Entity {
  @property({
    type: 'string',
    id: true,
    postgresql: { columnName: 'idUserTokenDocument', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  idUserTokenDocument: string;

  @belongsTo(() => UserToken, {name : 'user_token_join'}, {
    type: 'string',
    required: true,
    postgresql: {columnName: 'idUserToken', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'
  }})
  idUserToken: string;

  @belongsTo(() => Document, {name : 'document_join'}, {
    type: 'string',
    required: true,
    postgresql: {columnName: 'idDocument', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'
  }})
  idDocument: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserTokenDocument>) {
    super(data);
  }
}

export interface UserTokenDocumentRelations {
  // describe navigational properties here
}

export type UserTokenDocumentWithRelations = UserTokenDocument & UserTokenDocumentRelations;
