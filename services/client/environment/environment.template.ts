/* tslint:disable no-invalid-template-strings */

import { IClientEnvironment } from '.';

export const environment: IClientEnvironment = {
  gatewayUrl: '${GATEWAY_URL}',
  vapidPublicKey: '${VAPID_PUBLIC_KEY}',
};
