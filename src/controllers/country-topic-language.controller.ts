//Loopback imports
import { authenticate } from '@loopback/authentication';
import { Filter, repository } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getModelSchemaRef, patch, requestBody, HttpErrors } from '@loopback/rest';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { CountryTopicLanguage } from '../models';
import { CountryTopicLanguageRepository } from '../repositories';

export class CountryTopicLanguageController {
  constructor(
    @repository(CountryTopicLanguageRepository)
    public countryTopicLanguageRepository : CountryTopicLanguageRepository,
  ) {}

  //*** INSERT ***/
  @post('/countries-topics-languages', {
    responses: {
      '200': {
        description: 'CountryTopicLanguage model instance',
        content: {'application/json': {schema: getModelSchemaRef(CountryTopicLanguage)}},
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CountryTopicLanguage, {
            title: 'NewCountryTopicLanguage',
            exclude: ['idCountryTopicLanguage'],
          }),
        },
      },
    })
    countryTopicLanguage: Omit<CountryTopicLanguage, 'idCountryTopicLanguage'>,
  ): Promise<CountryTopicLanguage> {
    // Check if the language exists
    const languageExists = await this.checkLanguageExists(countryTopicLanguage.idCountryTopic, countryTopicLanguage.language);
    if (languageExists) {
      throw new HttpErrors.Conflict('The language exists, please patch');
    }
    
    return this.countryTopicLanguageRepository.create(countryTopicLanguage);
  }

  //*** DETAILS ***/
  @get('/countries-topics-languages/{id}', {
    responses: {
      '200': {
        description: 'CountryTopicLanguage model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CountryTopicLanguage, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(CountryTopicLanguage)) filter?: Filter<CountryTopicLanguage>
  ): Promise<CountryTopicLanguage> {
    return this.countryTopicLanguageRepository.findById(id, filter);
  }

  //*** UPDATE ***/
  @patch('/countries-topics-languages/{id}', {
    responses: {
      '204': {
        description: 'CountryTopicLanguage PATCH success',
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CountryTopicLanguage, {partial: true}),
        },
      },
    })
    countryTopicLanguage: CountryTopicLanguage,
  ): Promise<void> {
    // Check if the language exists
    const languageExists = await this.checkLanguageExists(countryTopicLanguage.idCountryTopic, countryTopicLanguage.language);
    if (languageExists === false) {
      throw new HttpErrors.Conflict('The language not exists, please post');
    }

    await this.countryTopicLanguageRepository.updateById(id, countryTopicLanguage);
  }

  async checkLanguageExists(idCountryTopic: string, language: string): Promise<boolean> {
    const filterLang: Filter = { where: { "idCountryTopic": idCountryTopic, "language": language } };
    const languageExists = await this.countryTopicLanguageRepository.findOne(filterLang);

    if (languageExists) {
      return true;
    } else {
      return false;
    }
  }
}
