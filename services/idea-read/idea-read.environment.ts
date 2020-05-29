import {injectable} from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class IdeaReadEnvironment {
  rpcPort = environment.ideaDetailsRpcPort;
  ideaRpcHost = environment.ideaHost;
  ideaEventStoreRpcPort = environment.ideaEventStoreRpcPort;
  ideaReadDatabaseUrl = environment.ideaReadDatabaseUrl;
  ideaReadDatabaseName = 'idea_read';
}
