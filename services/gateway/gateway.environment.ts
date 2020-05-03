import { injectable } from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class GatewayEnvironment {
  environment = environment.environment;
  port = 3000;
  accessTokenSecret = environment.accessTokenSecret;
  ideasRpcPort = environment.ideasRpcPort;
  ideasRpcHost = environment.ideasRpcHost;
  consumerRpcPort = environment.consumerRpcPort;
  consumerRpcHost = environment.consumerRpcHost;
  mainClientUrl = environment.mainClientUrl;
  adminClientUrl = environment.adminClientUrl;
  ideasHost = environment.ideasHost;
  consumerHost = environment.consumerHost;
  reviewsHost = environment.reviewsHost;
  usersHost = environment.usersHost;
  notificationsHost = environment.notificationsHost;
  adminHost = environment.adminHost;
  corsWhitelist = [environment.mainClientUrl, environment.adminClientUrl];
  usersRpcPort = environment.usersRpcPort;
  usersRpcHost = environment.usersRpcHost;
  frontendServerExchangeSecret = environment.frontendServerExchangeSecret;
}
