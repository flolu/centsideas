import { IServerEnvironment } from '@cents-ideas/models';

export interface IGatewayEnvironment extends IServerEnvironment {
  port: number;
  hosts: {
    ideas: string;
    consumer: string;
  };
  api: {
    ideas: {
      root: string;
    };
    reviews: {
      root: string;
    };
  };
}

const env: IGatewayEnvironment = {
  environment: process.env.NODE_ENV || 'dev',
  port: 3000,
  hosts: {
    ideas: `http://${process.env.IDEAS_SERVICE_HOST}` || 'http://ideas:3000',
    consumer: `http://${process.env.CONSUMER_SERVICE_HOST}` || 'http://consumer:3000',
  },
  api: {
    ideas: {
      root: '/ideas',
    },
    reviews: {
      root: '/reviews',
    },
  },
};

export default env;
