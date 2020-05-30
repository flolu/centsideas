import {Environments} from '@centsideas/enums';

// TODO clean up (split into a per-service level, more modular)
export interface IEnvironment {
  environment: Environments;
  gatewayUrl: string;
  mainClientUrl: string;

  ideaRpcPort: number;
  ideaHost: string;
  ideaDetailsHost: string;
  ideaDetailsRpcPort: number;
  ideaEventStoreRpcPort: number;
  ideaEventStoreDatabaseUrl: string;
  ideaReadDatabaseUrl: string;

  kafkaAdvertisedHostName: string;
  kafkaZookeeperConnect: string;
  kafkaAdvertisedPort: number;
  kafkaBrokerHost: string;

  refreshTokenSecret: string;
  accessTokenSecret: string;
  loginTokenSecret: string;
  changeEmailTokenSecret: string;
  frontendServerExchangeSecret: string;
  vapidPublicKey: string;
  vapidPrivateKey: string;
  sendgridApiKey: string;
  googleClientId: string;
  googleClientSecret: string;
}
