import { inject, lifeCycleObserver, LifeCycleObserver, ValueOrPromise } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  "name": "Gpp",
  "connector": "postgresql",
  "url": "",
  "host": "localhost",
  "port": 5432,
  "user": "gpp_user",
  "password": "btE63!DfE82wD74",
  "database": "gpp_db"
}

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class GppDatasourceDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'Gpp';

  constructor(
    @inject('datasources.config.postgres', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
