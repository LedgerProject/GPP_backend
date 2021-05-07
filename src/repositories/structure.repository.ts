// Loopback imports
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
// GPP imports
import { GppDataSource } from '../datasources';
import { Structure, StructureRelations, Icon, StructureCategory, StructureImage, StructureLanguage } from '../models';
import { IconRepository } from './icon.repository';
import { StructureCategoryRepository } from './structure-category.repository';
import { StructureImageRepository } from './structure-image.repository';
import { StructureLanguageRepository } from './structure-language.repository';

export class StructureRepository extends DefaultCrudRepository
  <Structure, typeof Structure.prototype.idStructure, StructureRelations> {
  public readonly icon: BelongsToAccessor<Icon, typeof Structure.prototype.idIcon>;
  public readonly structureCategory: HasManyRepositoryFactory<StructureCategory, typeof Structure.prototype.idStructure>;
  public readonly structureImage: HasManyRepositoryFactory<StructureImage, typeof Structure.prototype.idStructure>;
  public readonly structureLanguage: HasManyRepositoryFactory<StructureLanguage, typeof Structure.prototype.idStructure>;

  constructor(
    @inject('datasources.GppDataSource') dataSource: GppDataSource,
    @repository.getter('IconRepository') protected iconRepositoryGetter: Getter<IconRepository>,
    @repository.getter('StructureCategoryRepository') structureCategoryRepositoryGetter: Getter<StructureCategoryRepository>,
    @repository.getter('StructureImageRepository') structureImageRepositoryGetter: Getter<StructureImageRepository>,
    @repository.getter('StructureLanguageRepository') structureLanguageRepositoryGetter: Getter<StructureLanguageRepository>,
  ) {
    super(Structure, dataSource);
    this.icon = this.createBelongsToAccessorFor('icon_join', iconRepositoryGetter);
    this.structureCategory = this.createHasManyRepositoryFactoryFor('structureCategory', structureCategoryRepositoryGetter);
    this.structureImage = this.createHasManyRepositoryFactoryFor('structureImage', structureImageRepositoryGetter);
    this.structureLanguage = this.createHasManyRepositoryFactoryFor('structureLanguage', structureLanguageRepositoryGetter);

    this.registerInclusionResolver('icon', this.icon.inclusionResolver);
    this.registerInclusionResolver('structureCategory', this.structureCategory.inclusionResolver);
    this.registerInclusionResolver('structureImage', this.structureImage.inclusionResolver);
    this.registerInclusionResolver('structureLanguage', this.structureLanguage.inclusionResolver);
  }
}
