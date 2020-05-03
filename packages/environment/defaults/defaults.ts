export const defaultCommonEnv = {
  ideasRpcPort: 40000,
  consumerRpcPort: 40000,
  usersRpcPort: 40000,
  notificationsRpcPort: 40000,
  adminRpcPort: 40000,
};

export const defaultKubernetesEnv = {
  ideasRpcHost: 'centsideas-ideas',
  ideasHost: 'centsideas-ideas:3000',
  ideasDatabaseUrl: 'mongodb://centsideas-ideas-event-store:27017',

  usersRpcHost: 'centsideas-users',
  usersHost: 'centsideas-users:3000',
  usersDatabaseUrl: 'mongodb://centsideas-users-event-store:27017',

  consumerRpcHost: 'centsideas-consumer',
  consumerHost: 'centsideas-consumer:3000',
  projectionDatabaseUrl: 'mongodb://centsideas-projection-database:27017',

  notificationsHost: 'centsideas-notifications:3000',
  notificationsRpcHost: 'centsideas-notifications',
  notificationsDatabaseUrl: 'mongodb://centsideas-notifications-event-store:27017',

  reviewsHost: 'centsideas-reviews:3000',
  reviewsDatabaseUrl: 'mongodb://centsideas-reviews-event-store:27017',

  adminHost: 'centsideas-admin:3000',
  adminDatabaseUrl: 'mongodb://centsideas-admin-database:27017',
  adminRpcHost: 'centsideas-admin',

  kafkaAdvertisedHostName: '172.31.25.198',
  kafkaZookeeperConnect: 'zookeeper-service:2181',
  kafkaAdvertisedPort: 9092,
  kafkaBrokerHost: 'kafka-service:9092',
};

export const defaultDockerComposeEnv = {
  ideasHost: 'ideas:3000',
  consumerHost: 'consumer:3000',
  reviewsHost: 'reviews:3000',
  usersHost: 'users:3000',
  notificationsHost: 'notifications:3000',
  adminHost: 'admin:3000',
  ideasDatabaseUrl: 'mongodb://mongo-database:27017',
  reviewsDatabaseUrl: 'mongodb://mongo-database:27017',
  projectionDatabaseUrl: 'mongodb://mongo-database:27017',
  usersDatabaseUrl: 'mongodb://mongo-database:27017',
  notificationsDatabaseUrl: 'mongodb://mongo-database:27017',
  adminDatabaseUrl: 'mongodb://mongo-database:27017',
  kafkaAdvertisedHostName: 'kafka',
  kafkaZookeeperConnect: 'zookeeper:2181',
  kafkaAdvertisedPort: 9092,
  kafkaBrokerHost: 'kafka:9092',
};

export const defaultDynamicEnv = {
  refreshTokenSecret: '',
  accessTokenSecret: '',
  loginTokenSecret: '',
  changeEmailTokenSecret: '',
  frontendServerExchangeSecret: '',
  sendgridApiKey: '',
  googleClientId: '',
  googleClientSecret: '',
  vapidPublicKey: '',
  vapidPrivateKey: '',
};
