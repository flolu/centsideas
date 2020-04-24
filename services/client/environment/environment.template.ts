/* tslint:disable no-invalid-template-strings */

import { IClientEnvironment } from '.';

export const environment: IClientEnvironment = {
  gatewayHost: '${GATEWAY_HOST}',
  vapidPublicKey: '${VAPID_PUBLIC_KEY}',
};
