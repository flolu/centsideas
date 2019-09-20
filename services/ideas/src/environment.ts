import { Logger } from '@cents-ideas/utils';

const env = {
  environment: process.env.NODE_ENV,
  port: 3000,
  // FIXME inject logger?
  logger: new Logger('💡 '),
  database: {
    url: process.env.IDEAS_DATABASE_URL || 'mongodb://ideas-event-store:27017',
    name: 'ideas',
  },
};

export default env;
