import { Filter } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { OrganizationRepository } from '../repositories';

export async function checkOrganizationOwner(idOrganization: string, idUser: string, organizationRepository: OrganizationRepository): Promise<boolean> {
    const filterOwner: Filter = { where: { "idOrganization": idOrganization, "idUser": idUser, "permissions": ["OrganizationAdministrator"] } };
    const organizationOwned = await organizationRepository.findOne(filterOwner);
    if (!organizationOwned) {
        throw new HttpErrors.Forbidden("Organization not owned");
    } else {
        return true;
    }
}