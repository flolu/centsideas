import { Logger } from '@cents-ideas/utils';

const env = {
  environment: process.env.NODE_ENV,
  kafka: {
    brokers: ['172.18.0.1:9092'],
  },
};

export const logger = new Logger('😋 ');
export default env;
