//Loopback imports
import { authenticate } from '@loopback/authentication';
import { Filter, repository } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getModelSchemaRef, patch, del, requestBody, HttpErrors } from '@loopback/rest';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { CountryTopic, CountryTopicLanguage } from '../models';
import { CountryTopicRepository, CountryTopicLanguageRepository } from '../repositories';

export class CountryTopicController {
  constructor(
    @repository(CountryTopicRepository)
    public countryTopicRepository : CountryTopicRepository,
    @repository(CountryTopicLanguageRepository)
    public countryTopicLanguageRepository : CountryTopicLanguageRepository,
  ) {}

  //*** INSERT ***/
  @post('/countries-topics', {
    responses: {
      '200': {
        description: 'CountryTopic model instance',
        content: {'application/json': {schema: getModelSchemaRef(CountryTopic)}},
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CountryTopic, {
            title: 'NewCountryTopic',
            exclude: ['idCountryTopic'],
          }),
        },
      },
    })
    countryTopic: Omit<CountryTopic, 'idCountryTopic'>,
  ): Promise<CountryTopic> {
    // Check if the identifier is already assigned
    const filter: Filter = { where: { idCountry: countryTopic.idCountry, identifier : countryTopic.identifier }};
    const identifierExists = await this.countryTopicRepository.findOne(filter);

    if (identifierExists !== null) {
      throw new HttpErrors.Conflict("The identifier specified is already assigned, please change it");
    }

    return this.countryTopicRepository.create(countryTopic);
  }

  //*** LIST ***/
  @get('/countries-topics', {
    responses: {
      '200': {
        description: 'Array of CountryTopic model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(CountryTopic, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async find(
    @param.query.object('filter', getFilterSchemaFor(CountryTopic)) filter?: Filter<CountryTopic>,
  ): Promise<CountryTopic[]> {
    return this.countryTopicRepository.find(filter);
  }

  //*** DETAILS ***/
  @get('/countries-topics/{id}', {
    responses: {
      '200': {
        description: 'CountryTopic model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CountryTopic, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(CountryTopic)) filter?: Filter<CountryTopic>
  ): Promise<CountryTopic> {
    return this.countryTopicRepository.findById(id, filter);
  }

  //*** UPDATE ***/
  @patch('/countries-topics/{id}', {
    responses: {
      '204': {
        description: 'CountryTopic PATCH success',
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CountryTopic, {partial: true}),
        },
      },
    })
    countryTopic: CountryTopic,
  ): Promise<void> {
    // Check if the identifier is already assigned
    const filter: Filter = { where: { idCountryTopic: {nlike : id}, idCountry: countryTopic.idCountry, identifier : countryTopic.identifier }};
    const identifierExists = await this.countryTopicRepository.findOne(filter);

    if (identifierExists !== null) {
      throw new HttpErrors.Conflict("The identifier specified is already assigned, please change it");
    }

    await this.countryTopicRepository.updateById(id, countryTopic);
  }

  //*** DELETE ***/
  @del('/countries-topics/{id}', {
    responses: {
      '204': {
        description: 'CountryTopic DELETE success',
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralCountriesManagement] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.countryTopicRepository.deleteById(id);
  }

  //*** LANGUAGES LIST ***/
  @get('/countries-topics/{id}/countries-topics-languages', {
    responses: {
      '200': {
        description: 'Array of CountryTopicLanguage model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(CountryTopicLanguage, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralCountriesManagement] })
  async findLanguages(
    @param.path.string('id') id: string,
  ): Promise<CountryTopicLanguage[]> {
    const filter: Filter = { where: { "idCountryTopic": id } };
    return this.countryTopicLanguageRepository.find(filter);
  }
}
