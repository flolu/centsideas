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
};

export const defaultStagingEnv: IEnvironment = {
  environment: Environments.Staging,
  ...defaultCommonEnv,
  ...defaultDynamicEnv,
  ...defaultKubernetesEnv,

  gatewayUrl: 'http://api.localhost',
  mainClientUrl: 'http://localhost',
};

export const defaultProdEnv: IEnvironment = {
  environment: Environments.Prod,
  ...defaultCommonEnv,
  ...defaultKubernetesEnv,
  ...defaultDynamicEnv,

  gatewayUrl: 'https://api.centsideas.com',
  mainClientUrl: 'https://centsideas.com',
};
