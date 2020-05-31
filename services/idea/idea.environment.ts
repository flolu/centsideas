import {injectable} from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class IdeaEnvironment {
  rpcPort = environment.ideaRpcPort;
  ideaEventStoreDatabaseUrl = environment.ideaEventStoreDatabaseUrl;
  ideaEventStoreDatabaseName = 'idea_event_store';
}
