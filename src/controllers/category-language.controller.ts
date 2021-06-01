//Loopback imports
import { authenticate } from '@loopback/authentication';
import { Filter, repository } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getModelSchemaRef, requestBody } from '@loopback/rest';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import {CategoryLanguage} from '../models';
import {CategoryLanguageRepository} from '../repositories';

export class CategoryLanguageController {
  constructor(
    @repository(CategoryLanguageRepository) public categoryLanguageRepository : CategoryLanguageRepository,
  ) {}
  
  //*** INSERT/UPDATE ***/
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
    const filterLang: Filter = { where: { "idCategory": categoryLanguage.idCategory, "language": categoryLanguage.language } };
    const languageExists = await this.categoryLanguageRepository.findOne(filterLang);

    if (languageExists !== null) {
      // The language exists, update it
      await this.categoryLanguageRepository.updateById(languageExists.idCategoryLanguage, categoryLanguage);
      const updatedLang = await this.categoryLanguageRepository.findById(languageExists.idCategoryLanguage);
      return updatedLang;
    } else {
      // The language not exists, insert it
      return this.categoryLanguageRepository.create(categoryLanguage);
    }
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
}
