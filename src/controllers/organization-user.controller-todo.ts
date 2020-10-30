/*
@post('/organization-users', {
    responses: {
      '200': {
        description: 'OrganizationUser model instance',
        content: {'application/json': {schema: getModelSchemaRef(OrganizationUser)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrganizationUser, {
            title: 'NewOrganizationUser',
            exclude: ['idOrganizationUser'],
          }),
        },
      },
    })
    organizationUser: Omit<OrganizationUser, 'idOrganizationUser'>,
  ): Promise<OrganizationUser> {
    return this.organizationUserRepository.create(organizationUser);
  }

  @get('/organization-users/count', {
    responses: {
      '200': {
        description: 'OrganizationUser model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(OrganizationUser)) where?: Where<OrganizationUser>,
  ): Promise<Count> {
    return this.organizationUserRepository.count(where);
  }

  @get('/organization-users', {
    responses: {
      '200': {
        description: 'Array of OrganizationUser model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(OrganizationUser, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(OrganizationUser)) filter?: Filter<OrganizationUser>,
  ): Promise<OrganizationUser[]> {
    return this.organizationUserRepository.find(filter);
  }

  @patch('/organization-users', {
    responses: {
      '200': {
        description: 'OrganizationUser PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrganizationUser, {partial: true}),
        },
      },
    })
    organizationUser: OrganizationUser,
    @param.query.object('where', getWhereSchemaFor(OrganizationUser)) where?: Where<OrganizationUser>,
  ): Promise<Count> {
    return this.organizationUserRepository.updateAll(organizationUser, where);
  }

  @get('/organization-users/{id}', {
    responses: {
      '200': {
        description: 'OrganizationUser model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(OrganizationUser, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(OrganizationUser)) filter?: Filter<OrganizationUser>
  ): Promise<OrganizationUser> {
    return this.organizationUserRepository.findById(id, filter);
  }

  @patch('/organization-users/{id}', {
    responses: {
      '204': {
        description: 'OrganizationUser PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrganizationUser, {partial: true}),
        },
      },
    })
    organizationUser: OrganizationUser,
  ): Promise<void> {
    await this.organizationUserRepository.updateById(id, organizationUser);
  }

  @put('/organization-users/{id}', {
    responses: {
      '204': {
        description: 'OrganizationUser PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() organizationUser: OrganizationUser,
  ): Promise<void> {
    await this.organizationUserRepository.replaceById(id, organizationUser);
  }

  @del('/organization-users/{id}', {
    responses: {
      '204': {
        description: 'OrganizationUser DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.organizationUserRepository.deleteById(id);
  }
*/
