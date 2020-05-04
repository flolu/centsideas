import { injectable } from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class IdeasEnvironment {
  port = 3000;
  ideasDatabaseName = 'ideas';

  ideasDatabaseUrl = environment.ideasDatabaseUrl;
  rpcPort = environment.ideasRpcPort;
  adminHost = environment.adminHost;
}
