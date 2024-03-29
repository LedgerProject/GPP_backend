import { Filter } from '@loopback/repository';
import { DocumentEncryptedChunksRepository, ContentMediaEncryptedChunksRepository } from '../repositories';
import { retrieveJsonFromBlockchain, writeIntoBlockchain } from './fantom-service';

export async function movePendingToCommitted(documentEncryptedChunksRepository: DocumentEncryptedChunksRepository): Promise<void> {
    const statusPendingFilter: Filter = { where: { "status": "PENDING" } };
    const allChunksinPendingState = await documentEncryptedChunksRepository.find(statusPendingFilter);
    console.log(".movePendingToCommitted gpp-cronjobs started: it found", allChunksinPendingState.length, "chunks in PENDING");
    allChunksinPendingState.forEach(async chunk => {
        //Cerca se il chunk ora è scritto sulla blockchain
        let json = await retrieveJsonFromBlockchain(chunk.transactionId!, chunk.idDocumentEncryptedChunk);
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

export async function moveNullToPending(documentEncryptedChunksRepository: DocumentEncryptedChunksRepository): Promise<void> {
    const statusPendingFilter: Filter = { where: { "status": null }, limit: 1 };
    const allChunksinNullState = await documentEncryptedChunksRepository.find(statusPendingFilter);
    console.log(".moveNullToPending gpp-cronjobs started ");
    allChunksinNullState.forEach(async chunk => {
        let jsonToSave = {
            "header": chunk.header,
            "checksum": chunk.checksum,
            "iv": chunk.iv,
            "ipfsPath": chunk.ipfsPath
        }

        console.log(".moveNullToPending gpp-cronjobs trying to write " + chunk.idDocument);
        let response = await writeIntoBlockchain(jsonToSave, chunk.idDocumentEncryptedChunk);
        if (!response.error) {
            chunk.transactionId = response.identifier;
            chunk.status = 'PENDING';
        }
        documentEncryptedChunksRepository.save(chunk);
    });
    console.log(".moveNullToPending gpp-cronjobs ended");
}

export async function movePendingToCommittedContentMedia(contentMediaEncryptedChunksRepository: ContentMediaEncryptedChunksRepository): Promise<void> {
    const statusPendingFilter: Filter = { where: { "status": "PENDING" } };
    const allChunksinPendingState = await contentMediaEncryptedChunksRepository.find(statusPendingFilter);
    console.log(".movePendingToCommittedContentMedia gpp-cronjobs started: it found", allChunksinPendingState.length, "chunks in PENDING");
    allChunksinPendingState.forEach(async chunk => {
        //Cerca se il chunk ora è scritto sulla blockchain
        let json = await retrieveJsonFromBlockchain(chunk.transactionId!, chunk.idContentMediaEncryptedChunk);
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

export async function moveNullToPendingContentMedia(contentMediaEncryptedChunksRepository: ContentMediaEncryptedChunksRepository): Promise<void> {
    const statusPendingFilter: Filter = { where: { "status": null }, limit: 1 };
    const allChunksinNullState = await contentMediaEncryptedChunksRepository.find(statusPendingFilter);
    console.log(".moveNullToPendingContentMedia gpp-cronjobs started");
    allChunksinNullState.forEach(async chunk => {
        let jsonToSave = {
            "header": chunk.header,
            "checksum": chunk.checksum,
            "iv": chunk.iv,
            "ipfsPath": chunk.ipfsPath
        }

        console.log(".moveNullToPendingContentMedia gpp-cronjobs trying to write " + chunk.idDocument);
        chunk.transactionId = await writeIntoBlockchain(jsonToSave, chunk.idContentMediaEncryptedChunk);
        if (chunk.transactionId) {
            chunk.status = 'PENDING';
        }
        contentMediaEncryptedChunksRepository.save(chunk);
    });
    console.log(".moveNullToPendingContentMedia gpp-cronjobs ended");
}