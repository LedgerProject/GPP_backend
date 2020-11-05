// Loopback imports
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { Filter, repository } from '@loopback/repository';
import { post, param, getModelSchemaRef, del, requestBody, HttpErrors } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
// GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { StructureCategory } from '../models';
import { StructureCategoryRepository, StructureRepository } from '../repositories';
import { checkStructureOwner } from '../services/structure.service';

export class StructureCategoryController {
  constructor(
    @repository(StructureCategoryRepository)
    public structureCategoryRepository : StructureCategoryRepository,
    @repository(StructureRepository)
    public structureRepository : StructureRepository,
    @inject(SecurityBindings.USER)
    public user: UserProfile
  ) {}

  //*** INSERT ***/
  @post('/structures-categories', {
    responses: {
      '200': {
        description: 'StructureCategory model instance',
        content: {'application/json': {schema: getModelSchemaRef(StructureCategory)}},
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureCreation, PermissionKeys.GeneralStructuresManagement] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StructureCategory, {
            title: 'NewStructureCategory',
            exclude: ['idStructureCategory'],
          }),
        },
      },
    })
    structureCategory: Omit<StructureCategory, 'idStructureCategory'>,
  ): Promise<StructureCategory> {
    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(structureCategory.idStructure, this.user.idOrganization, this.structureRepository);
    }

    // Check if the category exists
    const categoryExists = await this.checkCategoryExists(structureCategory.idStructure, structureCategory.idCategory);
    if (categoryExists) {
      throw new HttpErrors.Conflict('The category is already assigned to the structure');
    }

    return this.structureCategoryRepository.create(structureCategory);
  }

  //*** DELETE ***/
  @del('/structures-categories/{id}', {
    responses: {
      '204': {
        description: 'StructureCategory DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureDelete, PermissionKeys.GeneralStructuresManagement] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const filterImg: Filter = { where: { "idStructureCategory": id } };
    const categoryDetail = await this.structureCategoryRepository.findOne(filterImg);

    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(categoryDetail!.idStructure, this.user.idOrganization, this.structureRepository);
    }

    await this.structureCategoryRepository.deleteById(id);
  }

  async checkCategoryExists(idStructure: string, idCategory: string): Promise<boolean> {
    const filterLang: Filter = { where: { "idStructure": idStructure, "idCategory": idCategory } };
    const categoryExists = await this.structureCategoryRepository.findOne(filterLang);

    if (categoryExists) {
      return true;
    } else {
      return false;
    }
  }
}
