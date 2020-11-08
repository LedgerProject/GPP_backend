//Loopback imports
import { authenticate } from '@loopback/authentication';
import { Filter, repository } from '@loopback/repository';
import { del, post, param, get, getFilterSchemaFor, getModelSchemaRef, patch, requestBody, HttpErrors } from '@loopback/rest';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { Category, CategoryLanguage } from '../models';
import { CategoryRepository, CategoryLanguageRepository } from '../repositories';

export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository : CategoryRepository,
    @repository(CategoryLanguageRepository)
    public categoryLanguageRepository : CategoryLanguageRepository,
  ) {}

  //*** LIST ***/
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
  @authenticate('jwt', { "required": [PermissionKeys.OrganizationStructuresManagement, PermissionKeys.GeneralCategoriesManagement] })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Category)) filter?: Filter<Category>,
  ): Promise<Category[]> {
    return this.categoryRepository.find(filter);
  }
  
  //*** INSERT ***/
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
    // Check if the identifier is already assigned
    const filter: Filter = { where: { identifier : category.identifier, type : category.type }};
    const identifierExists = await this.categoryRepository.findOne(filter);

    if (identifierExists !== null) {
      throw new HttpErrors.Conflict("The identifier specified is already assigned, please change it");
    }

    return this.categoryRepository.create(category);
  }

  //*** DETAILS ***/
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

  //*** UPDATE ***/
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
    // Check if the identifier is already assigned
    const filter: Filter = { where: { idCategory : { nlike: id }, identifier : category.identifier, type : category.type }};
    const identifierExists = await this.categoryRepository.findOne(filter);

    if (identifierExists !== null) {
      throw new HttpErrors.Conflict("The identifier specified is already assigned, please change it");
    }

    await this.categoryRepository.updateById(id, category);
  }

  //*** DELETE ***/
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

  //*** LANGUAGES LIST ***/
  @get('/categories/{id}/categories-languages', {
    responses: {
      '200': {
        description: 'Array of CategoryLanguage model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(CategoryLanguage, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralCategoriesManagement] })
  async findLanguages(
    @param.path.string('id') id: string,
  ): Promise<CategoryLanguage[]> {
    const filter: Filter = { where: { "idCategory": id } };
    return this.categoryLanguageRepository.find(filter);
  }
}
