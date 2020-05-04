import { injectable } from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class IdeasEnvironment {
  port = 3000;
  rpcPort = environment.ideasRpcPort;
  ideasDatabaseName = 'ideas';
  ideasDatabaseUrl = environment.ideasDatabaseUrl;
  adminHost = environment.adminHost;
}
