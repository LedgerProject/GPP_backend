import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {OrganizationUser} from '../models';
import {OrganizationUserRepository} from '../repositories';

export class OrganizationUserController {
  constructor(
    @repository(OrganizationUserRepository)
    public organizationUserRepository : OrganizationUserRepository,
  ) {}


}
