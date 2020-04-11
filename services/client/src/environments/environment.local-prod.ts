import { IEnvironment } from './environment.model';

export const localProdEnv: IEnvironment = {
  production: true,
  gatewayHost: 'http://localhost:3000',
};
