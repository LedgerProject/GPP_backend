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

  //*** LIST ***/
  @get('/icons', {
    responses: {
      '200': {
        description: 'Array of Icon model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Icon, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.OrganizationStructuresManagement, PermissionKeys.GeneralIconsManagement] })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Icon)) filter?: Filter<Icon>,
  ): Promise<Icon[]> {
    return this.iconRepository.find(filter);
  }

  //*** INSERT ***/
  @post('/icons', {
    responses: {
      '200': {
        description: 'Icon model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Icon) } },
      },
    },
  })
  @authenticate('jwt', { "required": [PermissionKeys.GeneralIconsManagement] })
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

  //*** DETAILS ***/
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
  @authenticate('jwt', { required: [PermissionKeys.GeneralIconsManagement] })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Icon)) filter?: Filter<Icon>
  ): Promise<Icon> {
    return this.iconRepository.findById(id, filter);
  }

  //*** UPDATE ***/
  @patch('/icons/{id}', {
    responses: {
      '204': {
        description: 'Icon PATCH success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralIconsManagement] })
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

  //*** DELETE ***/
  @del('/icons/{id}', {
    responses: {
      '204': {
        description: 'Icon DELETE success',
      },
    },
  })
  @authenticate('jwt', { required: [PermissionKeys.GeneralIconsManagement] })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.iconRepository.deleteById(id);
  }
}
