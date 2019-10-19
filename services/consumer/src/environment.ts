import { IServerEnvironment } from '@cents-ideas/models';

export interface IConsumerEnvironment extends IServerEnvironment {
  kafka: {
    brokers: string[];
  };
  database: {
    url: string;
  };
  port: number;
}

const env: IConsumerEnvironment = {
  environment: process.env.NODE_ENV || 'dev',
  kafka: {
    brokers: [process.env.KAFKA_BROKER_HOST || '172.18.0.1:9092'],
  },
  database: {
    url: process.env.PROJECTION_DATABASE_URL || 'mongodb://projection-database:27017',
  },
  port: 3000,
};

export default env;
