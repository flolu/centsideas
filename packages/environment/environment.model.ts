export interface IEnvironment {
  environment: string;
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
  ideasRpcPort: number;
  ideasRpcHost: string;
  mainClientUrl: string;
  adminClientUrl: string;
  adminSocketUrl: string;
  ideasHost: string;
  consumerHost: string;
  reviewsHost: string;
  usersHost: string;
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
