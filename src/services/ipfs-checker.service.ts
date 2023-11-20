import { Filter } from '@loopback/repository';
import { DocumentEncryptedChunksRepository, ContentMediaEncryptedChunksRepository } from '../repositories';
import { uploadStringToIPFS } from './ipfs-service';

export async function moveNullToIPFS(documentEncryptedChunksRepository: DocumentEncryptedChunksRepository): Promise<void> {
    const nullIpfsFilter: Filter = { where: { "ipfsPath": null } };
    const allChunksinNullState = await documentEncryptedChunksRepository.find(nullIpfsFilter);
    console.log(".moveNullToIPFS gpp-cronjobs started ");
    allChunksinNullState.forEach(async chunk => {

        chunk.ipfsPath = await uploadStringToIPFS(chunk.text!);

        console.log(".moveNullToIPFS gpp-cronjobs trying to write " + chunk.idDocument);

        documentEncryptedChunksRepository.save(chunk);
    });
    console.log(".moveNullToIPFS gpp-cronjobs ended");
}