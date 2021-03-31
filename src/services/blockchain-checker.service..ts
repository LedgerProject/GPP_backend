import { Filter } from '@loopback/repository';
import { DocumentEncryptedChunksRepository } from '../repositories';
import { retrieveJsonFromBlockchain } from './sawroom-service';

export async function movePendingToCommitted(documentEncryptedChunksRepository: DocumentEncryptedChunksRepository): Promise<void> {
    const statusPendingFilter: Filter = { where: { "status": "PENDING"} };
    const allChunksinPendingState = await documentEncryptedChunksRepository.find(statusPendingFilter);

    allChunksinPendingState.forEach(async chunk => {
        //Cerca se il chunk ora è scritto sulla blockchain
        let json = await retrieveJsonFromBlockchain(chunk.transactionId!);
        if (json){
            //Json is different from null, it means we retrieved something from blockchain
            chunk.status = 'COMMITTED';
            documentEncryptedChunksRepository.save(chunk);
        } else {
            console.error(".movePendingToCommitted Something went wrong with chunk id: {}. Please check", chunk.idDocumentEncryptedChunk)
        }
    });
}