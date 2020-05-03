import { Environments } from '@centsideas/enums';
import {
  defaultDynamicEnv,
  defaultDockerComposeEnv,
  defaultCommonEnv,
  defaultKubernetesEnv,
} from './defaults';
import { IEnvironment } from '../environment.model';

export const defaultDevEnv: IEnvironment = {
  environment: Environments.Dev,
  gatewayUrl: 'http://localhost:3000',
  ideasRpcHost: 'ideas',
  usersRpcHost: 'users',
  consumerRpcHost: 'consumer',
  adminRpcHost: 'admin',
  notificationsRpcHost: 'notifications',
  mainClientUrl: 'http://localhost:4200',
  adminClientUrl: 'http://localhost:8080',
  adminSocketUrl: 'http://localhost:3001',
  ...defaultDockerComposeEnv,
  ...defaultDynamicEnv,
  ...defaultCommonEnv,
};

export const defaultStagingEnv: IEnvironment = {
  environment: Environments.Staging,
  gatewayUrl: 'http://api.localhost',
  mainClientUrl: 'http://localhost',
  adminClientUrl: 'http://admin.localhost',
  adminSocketUrl: 'http://admin.localhost',
  ...defaultCommonEnv,
  ...defaultDynamicEnv,
  ...defaultKubernetesEnv,
};

export const defaultProdEnv: IEnvironment = {
  environment: Environments.Prod,
  gatewayUrl: 'https://api.centsideas.com',
  mainClientUrl: 'https://centsideas.com',
  adminClientUrl: 'https://admin.centsideas.com',
  adminSocketUrl: 'https://admin.centsideas.com',
  ...defaultCommonEnv,
  ...defaultKubernetesEnv,
  ...defaultDynamicEnv,
};
