import { injectable } from 'inversify';

import { Environments } from '@centsideas/enums';

@injectable()
export class GatewayEnvironment {
  environment: Environments = process.env.ENV as Environments;
  port = 3000;
  ideasRpcPort = process.env.IDEAS_RPC_PORT!;
  ideasRpcHost = process.env.IDEAS_RPC_HOST!;
  accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
  mainClientUrl = process.env.MAIN_CLIENT_URL!;
  adminClientUrl = process.env.ADMIN_CLIENT_URL!;
  ideasHost = process.env.IDEAS_SERVICE_HOST!;
  consumerHost = process.env.CONSUMER_SERVICE_HOST!;
  reviewsHost = process.env.REVIEWS_SERVICE_HOST!;
  usersHost = process.env.USERS_SERVICE_HOST!;
  notificationsHost = process.env.NOTIFICATIONS_SERVICE_HOST!;
  adminHost = process.env.ADMIN_SERVICE_HOST!;
}
