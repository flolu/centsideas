import { IServerEnvironment } from '@cents-ideas/models';

const env = {
  environment: process.env.NODE_ENV || 'dev',
  port: 3000,
  databaseUrl: process.env.USERS_DATABASE_URL || 'mongodb://users-event-store:27017',
  userDatabaseName: 'users',
  loginDatabaseName: 'logins',
};

export default env;
