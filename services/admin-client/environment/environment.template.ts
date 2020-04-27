/* tslint:disable no-invalid-template-strings */
import { IAdminClientEnvironment } from '.';

export const environment: IAdminClientEnvironment = {
  gatewayUrl: '${GATEWAY_URL}',
  adminSocketUrl: '${ADMIN_SOCKET_URL}',
};
