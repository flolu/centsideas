import { IServerEnvironment } from '@cents-ideas/models';

export interface IConsumerEnvironment extends IServerEnvironment {
  kafka: {
    brokers: string[];
  };
}

const env: IConsumerEnvironment = {
  environment: process.env.NODE_ENV || 'dev',
  kafka: {
    brokers: ['172.18.0.1:9092'],
  },
};

export default env;
