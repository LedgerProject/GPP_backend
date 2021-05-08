import { CronJob, cronJob } from '@loopback/cron';
import { movePendingToCommitted } from './blockchain-checker.service';
import { checkExpiredTokens } from './token.service';
import { DocumentEncryptedChunksRepository, UserTokenRepository } from '../repositories';
import { repository } from '@loopback/repository';

@cronJob()
export class MyCronJob extends CronJob {
  constructor(    
    @repository(DocumentEncryptedChunksRepository) public documentEncryptedChunkRepository : DocumentEncryptedChunksRepository,
    @repository(UserTokenRepository) public userTokenRepository : UserTokenRepository
  ) {
    super({
      name: 'gpp-cronjobs',
      onTick: () => {
        // do the work
        this.performMyJob();
      },
      cronTime: '*/10 * * * * *', // Every ten second
      start: true,
    });
  }

  performMyJob() {
    movePendingToCommitted(this.documentEncryptedChunkRepository);
    checkExpiredTokens(this.userTokenRepository);
  }
}