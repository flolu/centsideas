import {Environments} from '@centsideas/enums';

export interface IEnvironment {
  environment: Environments;
  gatewayUrl: string;
  ideasHost: string;
  usersHost: string;
  reviewsHost: string;
  adminHost: string;
  consumerHost: string;
  notificationsHost: string;

  mainClientUrl: string;
  frontendServerExchangeSecret: string;

  ideasRpcPort: number;
  ideasDatabaseUrl: string;
  ideaRpcPort: number;
  ideaHost: string;

  usersRpcPort: number;
  usersDatabaseUrl: string;
  refreshTokenSecret: string;
  accessTokenSecret: string;
  loginTokenSecret: string;
  changeEmailTokenSecret: string;
  googleClientId: string;
  googleClientSecret: string;

  notificationsRpcPort: number;
  notificationsDatabaseUrl: string;
  vapidPublicKey: string;
  vapidPrivateKey: string;
  sendgridApiKey: string;

  consumerRpcPort: number;
  projectionDatabaseUrl: string;

  adminClientUrl: string;
  adminSocketUrl: string;
  adminDatabaseUrl: string;
  adminRpcPort: number;

  reviewsDatabaseUrl: string;
  reviewsRpcPort: number;

  kafkaAdvertisedHostName: string;
  kafkaZookeeperConnect: string;
  kafkaAdvertisedPort: number;
  kafkaBrokerHost: string;
}
