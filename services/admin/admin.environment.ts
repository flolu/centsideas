import { injectable } from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class AdminEnvironment {
  environment = environment.environment;
  port = 3000;
  kafka = {
    brokers: [environment.kafkaBrokerHost],
  };
  database = {
    url: environment.adminDatabaseUrl,
    name: 'admin',
    eventsCollectionName: 'events',
  };
  rpc = {
    host: '0.0.0.0',
    port: environment.adminRpcPort,
  };
}
