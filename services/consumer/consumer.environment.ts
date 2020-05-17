import {injectable} from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class ConsumerEnvironment {
  port = 3000;
  kafka = {
    brokers: [environment.kafkaBrokerHost],
  };
  projectionDatabaseUrl = environment.projectionDatabaseUrl;
  projectionDatabaseName = 'projections';
  rpcPort = environment.consumerRpcPort;
}
