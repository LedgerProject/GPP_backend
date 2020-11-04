//Loopback imports
import { authenticate } from '@loopback/authentication';
import { Filter, repository } from '@loopback/repository';
import { del, post, param, get, getFilterSchemaFor, getModelSchemaRef, patch, requestBody } from '@loopback/rest';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { Category } from '../models';
import { CategoryRepository } from '../repositories';

export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository : CategoryRepository,
  ) {}

  //*** CATEGORY LIST ***/
  @get('/categories', {
    responses: {
      '200': {
        description: 'Array of Category model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Category, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCategoriesManagement] })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Category)) filter?: Filter<Category>,
  ): Promise<Category[]> {
    return this.categoryRepository.find(filter);
  }
  
  //*** CATEGORY INSERT ***/
  @post('/categories', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Category)}},
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCategoriesManagement] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategory',
            exclude: ['idCategory'],
          }),
        },
      },
    })
    category: Omit<Category, 'idCategory'>,
  ): Promise<Category> {
    return this.categoryRepository.create(category);
  }

  //*** CATEGORY DETAIL ***/
  @get('/categories/{id}', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Category, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCategoriesManagement] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Category)) filter?: Filter<Category>
  ): Promise<Category> {
    return this.categoryRepository.findById(id, filter);
  }

  //*** CATEGORY UPDATE ***/
  @patch('/categories/{id}', {
    responses: {
      '204': {
        description: 'Category PATCH success',
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCategoriesManagement] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Category,
  ): Promise<void> {
    await this.categoryRepository.updateById(id, category);
  }

  //*** CATEGORY DELETE ***/
  @del('/categories/{id}', {
    responses: {
      '204': {
        description: 'Category DELETE success',
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCategoriesManagement] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.categoryRepository.deleteById(id);
  }
}
