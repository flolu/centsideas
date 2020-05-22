import {injectable} from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class IdeaEnvironment {
  rpcPort = environment.ideasRpcPort;
}
