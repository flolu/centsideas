import { injectable } from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class ConsumerEnvironment {
  environment = environment.environment;
  port = 3000;
  kafka = {
    brokers: [environment.kafkaBrokerHost],
  };
  database = {
    url: environment.projectionDatabaseUrl,
    name: 'projections',
  };
}
