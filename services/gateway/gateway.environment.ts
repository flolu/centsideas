import {injectable} from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class GatewayEnvironment {
  accessTokenSecret = environment.accessTokenSecret;
  consumerRpcPort = environment.consumerRpcPort;
  consumerRpcHost = environment.consumerHost;
  mainClientUrl = environment.mainClientUrl;
  adminClientUrl = environment.adminClientUrl;
  usersRpcPort = environment.usersRpcPort;
  usersHost = environment.usersHost;
  notificationsRpcHost = environment.notificationsHost;
  notificationsRpcPort = environment.notificationsRpcPort;
  adminRpcHost = environment.adminHost;
  adminRpcPort = environment.adminRpcPort;

  ideaRpcHost = environment.ideaHost;
  ideaRpcPort = environment.ideaRpcPort;

  ideaDetailsRpcHost = environment.ideaDetailsHost;
  ideaDetailsRpcPort = environment.ideaDetailsRpcPort;

  frontendServerExchangeSecret = environment.frontendServerExchangeSecret;
  port = 3000;
  corsWhitelist = [environment.mainClientUrl, environment.adminClientUrl];
}
