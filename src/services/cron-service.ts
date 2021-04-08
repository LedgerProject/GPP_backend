import { CronJob, cronJob } from '@loopback/cron';
import { movePendingToCommitted } from './blockchain-checker.service.';
import { DocumentEncryptedChunksRepository } from '../repositories';
import { repository } from '@loopback/repository';

@cronJob()
export class MyCronJob extends CronJob {
  constructor(    
  @repository(DocumentEncryptedChunksRepository)
  public documentEncryptedChunkRepository : DocumentEncryptedChunksRepository) {
    super({
      name: 'blockchain-checker',
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
  }
}