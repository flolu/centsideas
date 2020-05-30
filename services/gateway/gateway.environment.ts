import {injectable} from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class GatewayEnvironment {
  accessTokenSecret = environment.accessTokenSecret;
  mainClientUrl = environment.mainClientUrl;
  ideaRpcHost = environment.ideaHost;
  ideaRpcPort = environment.ideaRpcPort;

  ideaDetailsRpcHost = environment.ideaDetailsHost;
  ideaDetailsRpcPort = environment.ideaDetailsRpcPort;

  frontendServerExchangeSecret = environment.frontendServerExchangeSecret;
  port = 3000;
  corsWhitelist = [environment.mainClientUrl];
}
