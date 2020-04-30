// seperate private and public env vars
// all public envs will automatically be placed into a k8s config map and all private into a secret
// all non-k8s stuff will consume envs from typescript libs

import { IEnvironment } from './environment.model';
import { defaultDevEnv } from './default-dev.environment';

const env: IEnvironment = { ...defaultDevEnv };

for (const key in defaultDevEnv) {
  // @ts-ignore
  if (typeof process === 'undefined') break;

  // @ts-ignore
  const envVar = process.env[key];
  if (envVar) (env as any)[key] = envVar;
}

export default env;

export const generatableKeyList: (keyof IEnvironment)[] = [
  'refreshTokenSecret',
  'accessTokenSecret',
  'loginTokenSecret',
  'changeEmailTokenSecret',
  'frontendServerExchangeSecret',
];

export const dynamicKeysList: (keyof IEnvironment)[] = [
  ...generatableKeyList,
  'vapidPublicKey',
  'vapidPrivateKey',
  'sendgridApiKey',
  'googleClientId',
  'googleClientSecret',
];
