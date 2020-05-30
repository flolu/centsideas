import 'reflect-metadata';
import {injectable} from 'inversify';

import environment from './index';

@injectable()
export class GlobalEnvironment {
  environment = environment.environment;
  gatewayUrl = environment.gatewayUrl;
  mainClientUrl = environment.mainClientUrl;
  kafkaAdvertisedHostName = environment.kafkaAdvertisedHostName;
  kafkaZookeeperConnect = environment.kafkaZookeeperConnect;
  kafkaAdvertisedPort = environment.kafkaAdvertisedPort;
  kafkaBrokerHost = environment.kafkaBrokerHost;
}
