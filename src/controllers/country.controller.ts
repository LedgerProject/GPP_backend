//Loopback imports
import { authenticate } from '@loopback/authentication';
import { Filter, repository } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getModelSchemaRef, patch, del, requestBody } from '@loopback/rest';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { Country, CountryLanguage } from '../models';
import { CountryRepository, CountryLanguageRepository } from '../repositories';

export class CountryController {
  constructor(
    @repository(CountryRepository)
    public countryRepository : CountryRepository,
    @repository(CountryLanguageRepository)
    public countryLanguageRepository : CountryLanguageRepository,
  ) {}

  //*** INSERT ***/
  @post('/countries', {
    responses: {
      '200': {
        description: 'Country model instance',
        content: {'application/json': {schema: getModelSchemaRef(Country)}},
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Country, {
            title: 'NewCountry',
            exclude: ['idCountry'],
          }),
        },
      },
    })
    country: Omit<Country, 'idCountry'>,
  ): Promise<Country> {
    return this.countryRepository.create(country);
  }

  //*** LIST ***/
  @get('/countries', {
    responses: {
      '200': {
        description: 'Array of Country model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Country, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Country)) filter?: Filter<Country>,
  ): Promise<Country[]> {
    return this.countryRepository.find(filter);
  }

  //*** DETAILS ***/
  @get('/countries/{id}', {
    responses: {
      '200': {
        description: 'Country model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Country, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Country)) filter?: Filter<Country>
  ): Promise<Country> {
    return this.countryRepository.findById(id, filter);
  }

  //*** UPDATE ***/
  @patch('/countries/{id}', {
    responses: {
      '204': {
        description: 'Country PATCH success',
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Country, {partial: true}),
        },
      },
    })
    country: Country,
  ): Promise<void> {
    await this.countryRepository.updateById(id, country);
  }

  //*** DELETE ***/
  @del('/countries/{id}', {
    responses: {
      '204': {
        description: 'Country DELETE success',
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.countryRepository.deleteById(id);
  }

  //*** LANGUAGES LIST ***/
  @get('/countries/{id}/countries-languages', {
    responses: {
      '200': {
        description: 'Array of CountryLanguage model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(CountryLanguage, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralCountriesManagement] })
  async findLanguages(
    @param.path.string('id') id: string,
  ): Promise<CountryLanguage[]> {
    const filter: Filter = { where: { "idCountry": id } };
    return this.countryLanguageRepository.find(filter);
  }
}
