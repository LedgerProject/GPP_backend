import {DefaultCrudRepository} from '@loopback/repository';
import {Document, DocumentRelations} from '../models';
import {GppDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DocumentRepository extends DefaultCrudRepository<
  Document,
  typeof Document.prototype.idDocument,
  DocumentRelations
> {
  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
  ) {
    super(Document, dataSource);
  }
}
