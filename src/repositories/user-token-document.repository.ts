//Loopback imports
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
//GPP imports
import { GppDataSource } from '../datasources';
import { UserToken, Document, UserTokenDocument, UserTokenDocumentRelations } from '../models';
import { UserTokenRepository } from './user-token.repository';
import { DocumentRepository } from './document.repository';

export class UserTokenDocumentRepository extends DefaultCrudRepository
  <UserTokenDocument, typeof UserTokenDocument.prototype.idUserTokenDocument, UserTokenDocumentRelations> {
  public readonly userToken: BelongsToAccessor<UserToken, typeof UserTokenDocument.prototype.idUserToken>;
  public readonly document: BelongsToAccessor<Document, typeof UserTokenDocument.prototype.idDocument>;

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('UserTokenRepository')
    protected userTokenRepositoryGetter: Getter<UserTokenRepository>,
    @repository.getter('DocumentRepository')
    protected documentRepositoryGetter: Getter<DocumentRepository>,
  ) {
    super(UserTokenDocument, dataSource);
    this.userToken = this.createBelongsToAccessorFor('user_token_join', userTokenRepositoryGetter);
    this.document = this.createBelongsToAccessorFor('document_join', documentRepositoryGetter);

    this.registerInclusionResolver('document', this.document.inclusionResolver);
  }
}
