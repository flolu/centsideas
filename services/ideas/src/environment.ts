import { Logger } from '@cents-ideas/utils';

const env = {
  environment: process.env.NODE_ENV,
  port: 3000,
  logger: new Logger('💡 '),
};

export default env;
