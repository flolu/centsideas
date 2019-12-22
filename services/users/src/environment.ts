import { IServerEnvironment } from '@cents-ideas/models';

export interface IUsersServiceEnvironment extends IServerEnvironment {
  port: number;
  database: {
    url: string;
    name: string;
  };
}
const env: IUsersServiceEnvironment = {
  environment: process.env.NODE_ENV || 'dev',
  port: 3000,
  database: {
    url: process.env.USERS_DATABASE_URL || 'mongodb://users-event-store:27017',
    name: 'users',
  },
};

export default env;
