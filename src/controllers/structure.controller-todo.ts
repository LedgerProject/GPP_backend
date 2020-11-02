/*
  @get('/structures/count', {
    responses: {
      '200': {
        description: 'Structure model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Structure)) where?: Where<Structure>,
  ): Promise<Count> {
    return this.structureRepository.count(where);
  }



  @patch('/structures', {
    responses: {
      '200': {
        description: 'Structure PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Structure, { partial: true }),
        },
      },
    })
    structure: Structure,
    @param.query.object('where', getWhereSchemaFor(Structure)) where?: Where<Structure>,
  ): Promise<Count> {
    return this.structureRepository.updateAll(structure, where);
  }

  @get('/structures/{id}', {
    responses: {
      '200': {
        description: 'Structure model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Structure, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Structure)) filter?: Filter<Structure>
  ): Promise<Structure> {
    return this.structureRepository.findById(id, filter);
  }

  @patch('/structures/{id}', {
    responses: {
      '204': {
        description: 'Structure PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Structure, { partial: true }),
        },
      },
    })
    structure: Structure,
  ): Promise<void> {
    await this.structureRepository.updateById(id, structure);
  }

  @put('/structures/{id}', {
    responses: {
      '204': {
        description: 'Structure PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() structure: Structure,
  ): Promise<void> {
    await this.structureRepository.replaceById(id, structure);
  }

  @del('/structures/{id}', {
    responses: {
      '204': {
        description: 'Structure DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.structureRepository.deleteById(id);
  }*/
