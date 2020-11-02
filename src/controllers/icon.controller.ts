//Loopback imports
import { authenticate } from '@loopback/authentication';
import { Filter, repository } from '@loopback/repository';
import { del, get, getFilterSchemaFor, getModelSchemaRef, param, patch, post, requestBody } from '@loopback/rest';
//GPP imports
import { PermissionKeys } from '../authorization/permission-keys';
import { Icon } from '../models';
import { IconRepository } from '../repositories';

export class IconController {
  constructor(
    @repository(IconRepository)
    public iconRepository: IconRepository,
  ) { }

  //*** ICON CREATION ***/
  @authenticate('jwt', { required: [PermissionKeys.GeneralIconsManagement] })
  @post('/icons', {
    responses: {
      '200': {
        description: 'Icon model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Icon) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Icon, {
            title: 'NewIcon',
            exclude: ['idIcon'],
          }),
        },
      },
    })
    icon: Omit<Icon, 'idIcon'>,
  ): Promise<Icon> {
    return this.iconRepository.create(icon);
  }

  @authenticate('jwt', { required: [PermissionKeys.GeneralIconsManagement] })
  @get('/icons/{id}', {
    responses: {
      '200': {
        description: 'Icon model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Icon, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Icon)) filter?: Filter<Icon>
  ): Promise<Icon> {
    return this.iconRepository.findById(id, filter);
  }

  @authenticate('jwt', { required: [PermissionKeys.GeneralIconsManagement] })
  @patch('/icons/{id}', {
    responses: {
      '204': {
        description: 'Icon PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Icon, { partial: true }),
        },
      },
    })
    icon: Icon,
  ): Promise<void> {
    await this.iconRepository.updateById(id, icon);
  }

  @authenticate('jwt', { required: [PermissionKeys.GeneralIconsManagement] })
  @del('/icons/{id}', {
    responses: {
      '204': {
        description: 'Icon DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.iconRepository.deleteById(id);
  }
}
