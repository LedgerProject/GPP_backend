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
  }*/
