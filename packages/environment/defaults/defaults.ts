export const defaultCommonEnv = {
  ideaRpcPort: 40000,
  consumerRpcPort: 40000,
  usersRpcPort: 40000,
  notificationsRpcPort: 40000,
  adminRpcPort: 40000,
  reviewsRpcPort: 40000,
  ideaDetailsRpcPort: 40000,
};

export const defaultKubernetesEnv = {
  ideaHost: 'centsideas-idea',
  ideaDetailsHost: 'centsideas-idea-read',
  ideaEventStoreDatabaseUrl: 'mongodb://centsideas-event-store:27017',
  ideaReadDatabaseUrl: 'mongodb://centsideas-idea-read:27017',

  usersHost: 'centsideas-users',
  usersDatabaseUrl: 'mongodb://centsideas-users-event-store:27017',

  consumerHost: 'centsideas-consumer',
  projectionDatabaseUrl: 'mongodb://centsideas-projection-database:27017',

  notificationsHost: 'centsideas-notifications',
  notificationsDatabaseUrl: 'mongodb://centsideas-notifications-event-store:27017',

  reviewsDatabaseUrl: 'mongodb://centsideas-reviews-event-store:27017',
  reviewsHost: 'centsideas-reviews',

  adminDatabaseUrl: 'mongodb://centsideas-admin-database:27017',
  adminHost: 'centsideas-admin',

  kafkaAdvertisedHostName: '172.31.25.198',
  kafkaZookeeperConnect: 'zookeeper-service:2181',
  kafkaAdvertisedPort: 9092,
  kafkaBrokerHost: 'kafka-service:9092',
};

export const defaultDockerComposeEnv = {
  ideaHost: 'idea',
  ideaDetailsHost: 'idea-read',
  ideaEventStoreDatabaseUrl: 'mongodb://mongo-database:27017',
  ideaReadDatabaseUrl: 'mongodb://mongo-database:27017',

  consumerHost: 'consumer',
  projectionDatabaseUrl: 'mongodb://mongo-database:27017',

  reviewsHost: 'reviews',
  reviewsDatabaseUrl: 'mongodb://mongo-database:27017',

  usersHost: 'users',
  usersDatabaseUrl: 'mongodb://mongo-database:27017',

  notificationsHost: 'notifications',
  notificationsDatabaseUrl: 'mongodb://mongo-database:27017',

  adminHost: 'admin',
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
