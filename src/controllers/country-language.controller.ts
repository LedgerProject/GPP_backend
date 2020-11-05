//Loopback imports
import { authenticate } from '@loopback/authentication';
import { Filter, repository } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getModelSchemaRef, patch, requestBody, HttpErrors } from '@loopback/rest';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import {CountryLanguage} from '../models';
import {CountryLanguageRepository} from '../repositories';

export class CountryLanguageController {
  constructor(
    @repository(CountryLanguageRepository)
    public countryLanguageRepository : CountryLanguageRepository,
  ) {}

  //*** INSERT ***/
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
    const languageExists = await this.checkLanguageExists(countryLanguage.idCountry, countryLanguage.language);
    if (languageExists) {
      throw new HttpErrors.Conflict('The language exists, please patch');
    }

    return this.countryLanguageRepository.create(countryLanguage);
  }

  //*** UPDATE ***/
  @patch('/countries-languages/{id}', {
    responses: {
      '204': {
        description: 'CountryLanguage PATCH success',
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CountryLanguage, {partial: true}),
        },
      },
    })
    countryLanguage: CountryLanguage,
  ): Promise<void> {
    // Check if the language exists
    const languageExists = await this.checkLanguageExists(countryLanguage.idCountry, countryLanguage.language);
    if (languageExists === false) {
      throw new HttpErrors.Conflict('The language not exists, please post');
    }

    await this.countryLanguageRepository.updateById(id, countryLanguage);
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

  async checkLanguageExists(idCountry: string, language: string): Promise<boolean> {
    const filterLang: Filter = { where: { "idCountry": idCountry, "language": language } };
    const languageExists = await this.countryLanguageRepository.findOne(filterLang);

    if (languageExists) {
      return true;
    } else {
      return false;
    }
  }
}
