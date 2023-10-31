import { CronJob, cronJob } from '@loopback/cron';
import { movePendingToCommitted, movePendingToCommittedContentMedia, moveNullToPending, moveNullToPendingContentMedia } from './blockchain-checker.service';
import { checkExpiredTokens } from './token.service';
import { DocumentEncryptedChunksRepository, ContentMediaEncryptedChunksRepository, UserTokenRepository } from '../repositories';
import { repository } from '@loopback/repository';

@cronJob()
export class MyCronJob extends CronJob {
  constructor(
    @repository(DocumentEncryptedChunksRepository) public documentEncryptedChunkRepository: DocumentEncryptedChunksRepository,
    @repository(ContentMediaEncryptedChunksRepository) public contentMediaEncryptedChunkRepository: ContentMediaEncryptedChunksRepository,
    @repository(UserTokenRepository) public userTokenRepository: UserTokenRepository
  ) {
    super({
      name: 'gpp-cronjobs',
      onTick: () => {
        // do the work
        this.performMyJob();
      },
      cronTime: '*/5 * * * *', // Every ten second
      start: true,
    });
  }

  performMyJob() {
    moveNullToPending(this.documentEncryptedChunkRepository);
    moveNullToPendingContentMedia(this.contentMediaEncryptedChunkRepository);
    movePendingToCommitted(this.documentEncryptedChunkRepository);
    movePendingToCommittedContentMedia(this.contentMediaEncryptedChunkRepository);
    checkExpiredTokens(this.userTokenRepository);
  }
}