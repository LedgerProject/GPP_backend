/*
@get('/icons/count', {
    responses: {
      '200': {
        description: 'Icon model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Icon)) where?: Where<Icon>,
  ): Promise<Count> {
    return this.iconRepository.count(where);
  }

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
  async find(
    @param.query.object('filter', getFilterSchemaFor(Icon)) filter?: Filter<Icon>,
  ): Promise<Icon[]> {
    return this.iconRepository.find(filter);
  }

  @patch('/icons', {
    responses: {
      '200': {
        description: 'Icon PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Icon, { partial: true }),
        },
      },
    })
    icon: Icon,
    @param.query.object('where', getWhereSchemaFor(Icon)) where?: Where<Icon>,
  ): Promise<Count> {
    return this.iconRepository.updateAll(icon, where);
  }

  @put('/icons/{id}', {
    responses: {
      '204': {
        description: 'Icon PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() icon: Icon,
  ): Promise<void> {
    await this.iconRepository.replaceById(id, icon);
  }
  */
