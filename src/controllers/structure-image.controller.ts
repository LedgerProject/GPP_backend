// Loopback importa
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { Filter, repository } from '@loopback/repository';
import { post, param, getModelSchemaRef, patch, del, requestBody} from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
// GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { StructureImage } from '../models';
import { StructureImageRepository, StructureRepository } from '../repositories';
import { checkStructureOwner } from '../services/structure.service';

export class StructureImageController {
  constructor(
    @repository(StructureImageRepository)
    public structureImageRepository : StructureImageRepository,
    @repository(StructureRepository)
    public structureRepository : StructureRepository,
    @inject(SecurityBindings.USER)
    public user: UserProfile
  ) {}

  //*** NEW STRUCTURE IMAGE ***/
  @post('/structures-images', {
    responses: {
      '200': {
        description: 'StructureImage model instance',
        content: {'application/json': {schema: getModelSchemaRef(StructureImage)}},
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureCreation, PermissionKeys.GeneralStructuresManagement] })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StructureImage, {
            title: 'NewStructureImage',
            exclude: ['idStructureImage'],
          }),
        },
      },
    })
    structureImage: Omit<StructureImage, 'idStructureImage'>,
  ): Promise<StructureImage> {
    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(structureImage.idStructure, this.user.idOrganization, this.structureRepository);
    }

    // Get the last sort number
    const filterSorting: Filter = { where: { "idStructure": structureImage.idStructure }, order: ["sorting DESC"] };
    const imageDetail = await this.structureImageRepository.findOne(filterSorting);
    
    // Apply the sort number
    if (imageDetail) {
      structureImage.sorting = imageDetail?.sorting + 1;
    } else {
      structureImage.sorting = 1;
    }

    return this.structureImageRepository.create(structureImage);
  }

  //*** UPDATE STRUCTURE IMAGE ***/
  @patch('/structures-images/{id}', {
    responses: {
      '204': {
        description: 'StructureImage PATCH success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureCreation, PermissionKeys.GeneralStructuresManagement] })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StructureImage, {partial: true}),
        },
      },
    })
    structureImage: StructureImage,
  ): Promise<void> {
    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(structureImage.idStructure, this.user.idOrganization, this.structureRepository);
    }

    await this.structureImageRepository.updateById(id, structureImage);
  }

  //*** DELETE STRUCTURE IMAGE ***/
  @del('/structures-images/{id}', {
    responses: {
      '204': {
        description: 'StructureImage DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.StructureDelete, PermissionKeys.GeneralStructuresManagement] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const filterImg: Filter = { where: { "idStructureImage": id } };
    const imageDetail = await this.structureImageRepository.findOne(filterImg);

    // If operator, check if it is an owned structure
    if (this.user.userType !== 'gppOperator') {
      await checkStructureOwner(imageDetail!.idStructure, this.user.idOrganization, this.structureRepository);
    }

    await this.structureImageRepository.deleteById(id);

    // Recalculate the structure sorting
    const filterSorting: Filter = { where: { "idStructure": imageDetail!.idStructure }, order: ["sorting ASC"] };
    const images: StructureImage[] = await this.structureImageRepository.find(filterSorting);

    let newSort = 0;
    for (const image of images) {
      newSort++;
      image.sorting = newSort;
      await this.structureImageRepository.updateById(image.idStructureImage, image);
    }
  }
}
