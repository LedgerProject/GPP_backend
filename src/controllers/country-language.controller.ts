//Loopback imports
import { authenticate } from '@loopback/authentication';
import { Filter, repository } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getModelSchemaRef, requestBody } from '@loopback/rest';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { CountryLanguage } from '../models';
import { CountryLanguageRepository } from '../repositories';

export class CountryLanguageController {
  constructor(
    @repository(CountryLanguageRepository)
    public countryLanguageRepository : CountryLanguageRepository,
  ) {}

  //*** INSERT/UPDATE ***/
  @post('/countries-languages', {
    responses: {
      '200': {
        description: 'CountryLanguage model instance',
        content: {'application/json': {schema: getModelSchemaRef(CountryLanguage)}},
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CountryLanguage, {
            title: 'NewCountryLanguage',
            exclude: ['idCountryLanguage'],
          }),
        },
      },
    })
    countryLanguage: Omit<CountryLanguage, 'idCountryLanguage'>,
  ): Promise<CountryLanguage> {
    // Check if the language exists
    const filterLang: Filter = { where: { "idCountry": countryLanguage.idCountry, "language": countryLanguage.language } };
    const languageExists = await this.countryLanguageRepository.findOne(filterLang);

    if (languageExists !== null) {
      // The language exists, update it
      await this.countryLanguageRepository.updateById(languageExists.idCountryLanguage, countryLanguage);
      const updatedLang = await this.countryLanguageRepository.findById(languageExists.idCountryLanguage);
      return updatedLang;
    } else {
      // The language not exists, insert it
      return this.countryLanguageRepository.create(countryLanguage);
    }
  }

  //*** DETAILS ***/
  @get('/countries-languages/{id}', {
    responses: {
      '200': {
        description: 'CountryLanguage model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CountryLanguage, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(CountryLanguage)) filter?: Filter<CountryLanguage>
  ): Promise<CountryLanguage> {
    return this.countryLanguageRepository.findById(id, filter);
  }
}
