import { Environments } from '@centsideas/enums';

export interface IEnvironment {
  environment: Environments;
  refreshTokenSecret: string;
  accessTokenSecret: string;
  loginTokenSecret: string;
  changeEmailTokenSecret: string;
  frontendServerExchangeSecret: string;
  sendgridApiKey: string;
  googleClientId: string;
  googleClientSecret: string;
  vapidPublicKey: string;
  vapidPrivateKey: string;

  // TODO rename to `ideasHost` etc...
  ideasRpcPort: number;
  ideasRpcHost: string;
  // TODO remove etc...
  ideasHost: string;

  usersRpcPort: number;
  usersRpcHost: string;
  usersHost: string;

  gatewayUrl: string;
  consumerRpcPort: number;
  consumerRpcHost: string;
  mainClientUrl: string;
  adminClientUrl: string;
  adminSocketUrl: string;
  consumerHost: string;
  reviewsHost: string;
  notificationsHost: string;
  adminHost: string;
  ideasDatabaseUrl: string;
  reviewsDatabaseUrl: string;
  projectionDatabaseUrl: string;
  usersDatabaseUrl: string;
  notificationsDatabaseUrl: string;
  adminDatabaseUrl: string;
  kafkaAdvertisedHostName: string;
  kafkaZookeeperConnect: string;
  kafkaAdvertisedPort: number;
  kafkaBrokerHost: string;
}
