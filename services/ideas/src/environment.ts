import { IServerEnvironment } from '@cents-ideas/models';

export interface IIdeasServiceEnvironment extends IServerEnvironment {
  port: number;
  database: {
    url: string;
    name: string;
  };
}
const env: IIdeasServiceEnvironment = {
  environment: process.env.NODE_ENV || 'dev',
  port: 3000,
  database: {
    url: process.env.IDEAS_DATABASE_URL || 'mongodb://ideas-event-store:27017',
    name: 'ideas',
  },
};

export default env;
