import { Filter } from '@loopback/repository';
import { DocumentEncryptedChunksRepository, ContentMediaEncryptedChunksRepository } from '../repositories';
import { retrieveJsonFromBlockchain } from './fantom-service';

export async function movePendingToCommitted(documentEncryptedChunksRepository: DocumentEncryptedChunksRepository): Promise<void> {
    const statusPendingFilter: Filter = { where: { "status": "PENDING" } };
    const allChunksinPendingState = await documentEncryptedChunksRepository.find(statusPendingFilter);
    console.log(".movePendingToCommitted gpp-cronjobs started: it found", allChunksinPendingState.length, "chunks in PENDING");
    allChunksinPendingState.forEach(async chunk => {
        //Cerca se il chunk ora è scritto sulla blockchain
        let json = await retrieveJsonFromBlockchain(chunk.transactionId!);
        if (json) {
            //Json is different from null, it means we retrieved something from blockchain
            chunk.status = 'COMMITTED';
            documentEncryptedChunksRepository.save(chunk);
        } else {
            console.error(".movePendingToCommitted Something went wrong with chunk id:", chunk.idDocumentEncryptedChunk, ". Please check")
        }
    });
    console.log(".movePendingToCommitted gpp-cronjobs ended");
}

export async function movePendingToCommittedContentMedia(contentMediaEncryptedChunksRepository: ContentMediaEncryptedChunksRepository): Promise<void> {
    const statusPendingFilter: Filter = { where: { "status": "PENDING" } };
    const allChunksinPendingState = await contentMediaEncryptedChunksRepository.find(statusPendingFilter);
    console.log(".movePendingToCommittedContentMedia gpp-cronjobs started: it found", allChunksinPendingState.length, "chunks in PENDING");
    allChunksinPendingState.forEach(async chunk => {
        //Cerca se il chunk ora è scritto sulla blockchain
        let json = await retrieveJsonFromBlockchain(chunk.transactionId!);
        if (json) {
            //Json is different from null, it means we retrieved something from blockchain
            chunk.status = 'COMMITTED';
            contentMediaEncryptedChunksRepository.save(chunk);
        } else {
            console.error(".movePendingToCommittedContentMedia Something went wrong with chunk id:", chunk.idContentMediaEncryptedChunk, ". Please check")
        }
    });
    console.log(".movePendingToCommittedContentMedia gpp-cronjobs ended");
}