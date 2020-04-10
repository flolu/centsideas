import { IEnvironment } from './environment.model';

export const prodEnv: IEnvironment = {
  production: true,
  gatewayHost: 'https://api.cents-ideas.flolu.com',
  // gatewayHost: 'http://localhost:3000',
};
