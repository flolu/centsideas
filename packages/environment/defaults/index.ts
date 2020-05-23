import {Environments} from '@centsideas/enums';

import {
  defaultDynamicEnv,
  defaultDockerComposeEnv,
  defaultCommonEnv,
  defaultKubernetesEnv,
} from './defaults';
import {IEnvironment} from '../environment.model';

export const defaultDevEnv: IEnvironment = {
  environment: Environments.Dev,
  ...defaultDockerComposeEnv,
  ...defaultDynamicEnv,
  ...defaultCommonEnv,

  gatewayUrl: 'http://localhost:3000',
  mainClientUrl: 'http://localhost:4200',
  adminClientUrl: 'http://localhost:8080',
  adminSocketUrl: 'http://localhost:3001',
};

export const defaultStagingEnv: IEnvironment = {
  environment: Environments.Staging,
  ...defaultCommonEnv,
  ...defaultDynamicEnv,
  ...defaultKubernetesEnv,

  gatewayUrl: 'http://api.localhost',
  mainClientUrl: 'http://localhost',
  adminClientUrl: 'http://admin.localhost',
  adminSocketUrl: 'http://socket.admin.localhost',
};

export const defaultProdEnv: IEnvironment = {
  environment: Environments.Prod,
  ...defaultCommonEnv,
  ...defaultKubernetesEnv,
  ...defaultDynamicEnv,

  gatewayUrl: 'https://api.centsideas.com',
  mainClientUrl: 'https://centsideas.com',
  adminClientUrl: 'https://admin.centsideas.com',
  adminSocketUrl: 'https://socket.admin.centsideas.com',
};
