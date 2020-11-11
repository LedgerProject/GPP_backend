//Loopback imports
import { authenticate } from '@loopback/authentication';
import { Filter, repository } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getModelSchemaRef, requestBody } from '@loopback/rest';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { NationalityLanguage } from '../models';
import { NationalityLanguageRepository } from '../repositories';

export class NationalityLanguageController {
  constructor(
    @repository(NationalityLanguageRepository)
    public nationalityLanguageRepository : NationalityLanguageRepository,
  ) {}

  //*** INSERT/UPDATE ***/
  @post('/nationalities-languages', {
    responses: {
      '200': {
        description: 'NationalityLanguage model instance',
        content: {'application/json': {schema: getModelSchemaRef(NationalityLanguage)}},
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralNationalitiesManagement] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NationalityLanguage, {
            title: 'NewNationalityLanguage',
            exclude: ['idNationalityLanguage'],
          }),
        },
      },
    })
    nationalityLanguage: Omit<NationalityLanguage, 'idNationalityLanguage'>,
  ): Promise<NationalityLanguage> {
    // Check if the language exists
    const filterLang: Filter = { where: { "idNationality": nationalityLanguage.idNationality, "language": nationalityLanguage.language } };
    const languageExists = await this.nationalityLanguageRepository.findOne(filterLang);

    if (languageExists !== null) {
      // The language exists, update it
      await this.nationalityLanguageRepository.updateById(languageExists.idNationalityLanguage, nationalityLanguage);
      const updatedLang = await this.nationalityLanguageRepository.findById(languageExists.idNationalityLanguage);
      return updatedLang;
    } else {
      // The language not exists, insert it
      return this.nationalityLanguageRepository.create(nationalityLanguage);
    }
  }

  //*** DETAILS ***/
  @get('/nationalities-languages/{id}', {
    responses: {
      '200': {
        description: 'NationalityLanguage model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(NationalityLanguage, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralNationalitiesManagement] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(NationalityLanguage)) filter?: Filter<NationalityLanguage>
  ): Promise<NationalityLanguage> {
    return this.nationalityLanguageRepository.findById(id, filter);
  }
}
