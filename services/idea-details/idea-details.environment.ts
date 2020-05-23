import {injectable} from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class IdeaDetailsEnvironment {
  rpcPort = environment.ideaDetailsRpcPort;
}
