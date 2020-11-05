//Loopback imports
import { authenticate } from '@loopback/authentication';
import { Filter, repository } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getModelSchemaRef, patch, requestBody, HttpErrors } from '@loopback/rest';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import {CategoryLanguage} from '../models';
import {CategoryLanguageRepository} from '../repositories';

export class CategoryLanguageController {
  constructor(
    @repository(CategoryLanguageRepository)
    public categoryLanguageRepository : CategoryLanguageRepository,
  ) {}
  
  //*** INSERT ***/
  @post('/categories-languages', {
    responses: {
      '200': {
        description: 'CategoryLanguage model instance',
        content: {'application/json': {schema: getModelSchemaRef(CategoryLanguage)}},
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCategoriesManagement] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CategoryLanguage, {
            title: 'NewCategoryLanguage',
            exclude: ['idCategoryLanguage'],
          }),
        },
      },
    })
    categoryLanguage: Omit<CategoryLanguage, 'idCategoryLanguage'>,
  ): Promise<CategoryLanguage> {
    // Check if the language exists
    const languageExists = await this.checkLanguageExists(categoryLanguage.idCategory, categoryLanguage.language);
    if (languageExists) {
      throw new HttpErrors.Conflict('The language exists, please patch');
    }

    return this.categoryLanguageRepository.create(categoryLanguage);
  }

  //*** UPDATE ***/
  @patch('/categories-languages/{id}', {
    responses: {
      '204': {
        description: 'CategoryLanguage PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CategoryLanguage, {partial: true}),
        },
      },
    })
    categoryLanguage: CategoryLanguage,
  ): Promise<void> {
    // Check if the language exists
    const languageExists = await this.checkLanguageExists(categoryLanguage.idCategory, categoryLanguage.language);
    if (languageExists === false) {
      throw new HttpErrors.Conflict('The language not exists, please post');
    }

    await this.categoryLanguageRepository.updateById(id, categoryLanguage);
  }

  //*** DETAILS ***/
  @get('/categories-languages/{id}', {
    responses: {
      '200': {
        description: 'CategoryLanguage model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CategoryLanguage, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCategoriesManagement] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(CategoryLanguage)) filter?: Filter<CategoryLanguage>
  ): Promise<CategoryLanguage> {
    return this.categoryLanguageRepository.findById(id, filter);
  }

  async checkLanguageExists(idCategory: string, language: string): Promise<boolean> {
    const filterLang: Filter = { where: { "idCategory": idCategory, "language": language } };
    const languageExists = await this.categoryLanguageRepository.findOne(filterLang);

    if (languageExists) {
      return true;
    } else {
      return false;
    }
  }
}
