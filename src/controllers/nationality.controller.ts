//Loopback imports
import { authenticate } from '@loopback/authentication';
import { Filter, repository } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getModelSchemaRef, patch, del, requestBody, HttpErrors } from '@loopback/rest';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { Nationality, NationalityLanguage } from '../models';
import { NationalityRepository, NationalityLanguageRepository } from '../repositories';

export class NationalityController {
  constructor(
    @repository(NationalityRepository)
    public nationalityRepository : NationalityRepository,
    @repository(NationalityLanguageRepository)
    public nationalityLanguageRepository : NationalityLanguageRepository,
  ) {}

  //*** INSERT ***/
  @post('/nationalities', {
    responses: {
      '200': {
        description: 'Nationality model instance',
        content: {'application/json': {schema: getModelSchemaRef(Nationality)}},
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralNationalitiesManagement] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Nationality, {
            title: 'NewNationality',
            exclude: ['idNationality'],
          }),
        },
      },
    })
    nationality: Omit<Nationality, 'idNationality'>,
  ): Promise<Nationality> {
    // Check if the identifier is already assigned
    const filter: Filter = { where: { identifier : nationality.identifier }};
    const identifierExists = await this.nationalityRepository.findOne(filter);

    if (identifierExists !== null) {
      throw new HttpErrors.Conflict("The identifier specified is already assigned, please change it");
    }

    return this.nationalityRepository.create(nationality);
  }

  //*** LIST ***/
  @get('/nationalities', {
    responses: {
      '200': {
        description: 'Array of Nationality model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Nationality, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralNationalitiesManagement] })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Nationality)) filter?: Filter<Nationality>,
  ): Promise<Nationality[]> {
    return this.nationalityRepository.find(filter);
  }

  //*** DETAILS ***/
  @get('/nationalities/{id}', {
    responses: {
      '200': {
        description: 'Nationality model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Nationality, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralNationalitiesManagement] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Nationality)) filter?: Filter<Nationality>
  ): Promise<Nationality> {
    return this.nationalityRepository.findById(id, filter);
  }

  //*** UPDATE ***/
  @patch('/nationalities/{id}', {
    responses: {
      '204': {
        description: 'Nationality PATCH success',
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralNationalitiesManagement] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Nationality, {partial: true}),
        },
      },
    })
    nationality: Nationality,
  ): Promise<void> {
    // Check if the identifier is already assigned
    const filter: Filter = { where: { id : { neq: id }, identifier : nationality.identifier }};
    const identifierExists = await this.nationalityRepository.findOne(filter);

    if (identifierExists !== null) {
      throw new HttpErrors.Conflict("The identifier specified is already assigned, please change it");
    }

    await this.nationalityRepository.updateById(id, nationality);
  }

  //*** DELETE ***/
  @del('/nationalities/{id}', {
    responses: {
      '204': {
        description: 'Nationality DELETE success',
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralNationalitiesManagement] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.nationalityRepository.deleteById(id);
  }

  //*** LANGUAGES LIST ***/
  @get('/nationalities/{id}/nationalities-languages', {
    responses: {
      '200': {
        description: 'Array of NationalityLanguage model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(NationalityLanguage, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralNationalitiesManagement] })
  async findLanguages(
    @param.path.string('id') id: string,
  ): Promise<NationalityLanguage[]> {
    const filter: Filter = { where: { "idCountry": id } };
    return this.nationalityLanguageRepository.find(filter);
  }
}
