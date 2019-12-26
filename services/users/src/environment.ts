import { IServerEnvironment } from '@cents-ideas/models';

export interface IUsersServiceEnvironment extends IServerEnvironment {
  port: number;
  databaseUrl: string;
  userDatabaseName: string;
  loginDatabaseName: string;
}

const env = {
  environment: process.env.NODE_ENV || 'dev',
  port: 3000,
  databaseUrl: process.env.USERS_DATABASE_URL || 'mongodb://users-event-store:27017',
  userDatabaseName: 'users',
  loginDatabaseName: 'logins',
  // TODO set a real secret from env vars for jwt signing
  jwtSecret: 'käsebrot mit kuchen',
};

export default env;
