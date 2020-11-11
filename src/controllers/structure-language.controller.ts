// Loopback imports
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { Filter, repository } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getModelSchemaRef, requestBody } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
// GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { StructureLanguage } from '../models';
import { StructureLanguageRepository, StructureRepository } from '../repositories';
import { checkStructureOwner } from '../services/structure.service';

export class StructureLanguageController {
  constructor(
    @repository(StructureLanguageRepository)
    public structureLanguageRepository : StructureLanguageRepository,
    @repository(StructureRepository)
    public structureRepository : StructureRepository,
    @inject(SecurityBindings.USER)
    public user: UserProfile
  ) {}

  //*** INSERT/UPDATE ***/
  @post('/structures-languages', {
    responses: {
      '200': {
        description: 'StructureLanguage model instance',
        content: {'application/json': {schema: getModelSchemaRef(StructureLanguage)}},
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureCreation, PermissionKeys.GeneralStructuresManagement] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StructureLanguage, {
            title: 'NewStructureLanguage',
            exclude: ['idStructureLanguage'],
          }),
        },
      },
    })
    structureLanguage: Omit<StructureLanguage, 'idStructureLanguage'>,
  ): Promise<StructureLanguage> {
    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(structureLanguage.idStructure, this.user.idOrganization, this.structureRepository);
    }

    // Check if the language exists
    const filterLang: Filter = { where: { "idStructure": structureLanguage.idStructure, "language": structureLanguage.language } };
    const languageExists = await this.structureLanguageRepository.findOne(filterLang);

    if (languageExists !== null) {
      // The language exists, update it
      await this.structureLanguageRepository.updateById(languageExists.idStructureLanguage, structureLanguage);
      const updatedLang = await this.structureLanguageRepository.findById(languageExists.idStructureLanguage);
      return updatedLang;
    } else {
      // The language not exists, insert it
      return this.structureLanguageRepository.create(structureLanguage);
    }
  }

  //*** DETAILS ***/
  @get('/structures-languages/{id}', {
    responses: {
      '200': {
        description: 'StructureLanguage model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(StructureLanguage, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureDetail, PermissionKeys.GeneralStructuresManagement] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(StructureLanguage)) filter?: Filter<StructureLanguage>
  ): Promise<StructureLanguage> {
    const filterLang: Filter = { where: { "idStructureLanguage": id } };
    const languageDetail = await this.structureLanguageRepository.findOne(filterLang);

    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(languageDetail!.idStructure, this.user.idOrganization, this.structureRepository);
    }

    return this.structureLanguageRepository.findById(id, filter);
  }
}
