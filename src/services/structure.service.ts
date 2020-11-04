import { Filter } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { StructureRepository } from '../repositories';

export async function checkStructureOwner(idStructure: string, idOrganization: string, structureRepository: StructureRepository): Promise<boolean> {
    const filterOwner: Filter = { where: { "idStructure": idStructure, "idOrganization": idOrganization } };
    const structureOwned = await structureRepository.findOne(filterOwner);
    if (!structureOwned) {
        throw new HttpErrors.Forbidden("Structure not owned");
    } else {
        return true;
    }
}