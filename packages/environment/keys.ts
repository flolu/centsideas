import {IEnvironment} from './environment.model';

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
