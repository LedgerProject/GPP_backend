import {CronJob, cronJob} from '@loopback/cron';

@cronJob()
export class MyCronJob extends CronJob {
  constructor() {
    super({
      name: 'my-job',
      onTick: () => {
        // do the work
        this.performMyJob();
      },
      cronTime: '*/10 * * * * *', // Every ten second
      start: true,
    });
  }

  performMyJob() {
    console.log('Job is running.');
  }
}