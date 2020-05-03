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

  gatewayUrl: string;
  mainClientUrl: string;

  // TODO rename to `ideasHost` etc...
  ideasRpcPort: number;
  ideasRpcHost: string;
  // TODO remove etc...
  ideasHost: string;
  ideasDatabaseUrl: string;

  usersRpcPort: number;
  usersRpcHost: string;
  usersHost: string;
  usersDatabaseUrl: string;

  notificationsRpcPort: number;
  notificationsRpcHost: string;
  notificationsHost: string;
  notificationsDatabaseUrl: string;

  consumerRpcPort: number;
  consumerRpcHost: string;
  consumerHost: string;
  projectionDatabaseUrl: string;

  adminClientUrl: string;
  adminSocketUrl: string;
  adminDatabaseUrl: string;
  adminHost: string;
  adminRpcPort: number;
  adminRpcHost: string;

  reviewsHost: string;
  reviewsDatabaseUrl: string;
  reviewsRpcPort: number;
  reviewsRpcHost: string;

  kafkaAdvertisedHostName: string;
  kafkaZookeeperConnect: string;
  kafkaAdvertisedPort: number;
  kafkaBrokerHost: string;
}
