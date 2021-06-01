import { Filter } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { ContentRepository } from '../repositories';

export async function checkContentOwner(idContent: string, idUser: string, contentRepository: ContentRepository): Promise<boolean> {
    const filterOwner: Filter = { where: { "idContent": idContent, "idUser": idUser} };
    const contentOwned = await contentRepository.findOne(filterOwner);
    if (!contentOwned) {
        throw new HttpErrors.Forbidden("Content not owned");
    } else {
        return true;
    }
}