// Loopback imports
import { inject, lifeCycleObserver, LifeCycleObserver, ValueOrPromise } from '@loopback/core';
import { juggler } from '@loopback/repository';

// Fix for parsing of numeric fields
const types = require('pg').types
types.setTypeParser(1700, 'text', parseFloat);

const config = {
  "name": process.env.DB_DATASOURCE,
  "connector": "postgresql",
  "url": "",
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "user": process.env.DB_USER,
  "password": process.env.DB_PWD,
  "database": process.env.DB_NAME
}

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class GppDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'GppDataSource';

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
