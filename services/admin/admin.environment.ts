import { injectable } from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class AdminEnvironment {
  port = 3000;
  kafka = {
    brokers: [environment.kafkaBrokerHost],
  };
  adminDatabaseUrl = environment.adminDatabaseUrl;
  adminDatabaseName = 'admin';
  errorDatabaseName = 'errors';
  eventsCollectionName = 'events';
  rpcPort = environment.adminRpcPort;
}
