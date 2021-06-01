//Loopback imports
import { authenticate } from '@loopback/authentication';
import { Filter, repository } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getModelSchemaRef, requestBody } from '@loopback/rest';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { CountryTopicLanguage } from '../models';
import { CountryTopicLanguageRepository } from '../repositories';

export class CountryTopicLanguageController {
  constructor(
    @repository(CountryTopicLanguageRepository) public countryTopicLanguageRepository : CountryTopicLanguageRepository,
  ) {}

  //*** INSERT/UPDATE ***/
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
    const filterLang: Filter = { where: { "idCountryTopic": countryTopicLanguage.idCountryTopic, "language": countryTopicLanguage.language } };
    const languageExists = await this.countryTopicLanguageRepository.findOne(filterLang);

    if (languageExists !== null) {
      // The language exists, update it
      await this.countryTopicLanguageRepository.updateById(languageExists.idCountryTopicLanguage, countryTopicLanguage);
      const updatedLang = await this.countryTopicLanguageRepository.findById(languageExists.idCountryTopicLanguage);
      return updatedLang;
    } else {
      // The language not exists, insert it
      return this.countryTopicLanguageRepository.create(countryTopicLanguage);
    }
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
}
