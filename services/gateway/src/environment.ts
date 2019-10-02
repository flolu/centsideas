import { IServerEnvironment } from '@cents-ideas/models';

export interface IGatewayEnvironment extends IServerEnvironment {
  port: number;
  hosts: {
    ideas: string;
  };
  api: {
    ideas: {
      root: string;
    };
  };
}

const env: IGatewayEnvironment = {
  environment: process.env.NODE_ENV || 'dev',
  port: 3000,
  hosts: {
    ideas: `http://${process.env.IDEAS_SERVICE_HOST}` || 'http://ideas:3000',
  },
  api: {
    ideas: {
      // TODO not as env var
      root: `/${process.env.IDEAS_API_ROOT}` || '/ideas',
    },
  },
};

export default env;
