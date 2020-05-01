import { injectable } from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class IdeasEnvironment {
  environment = environment.environment;
  port = 3000;
  rpc = {
    host: '0.0.0.0',
    port: environment.ideasRpcPort,
  };
  database = {
    url: environment.ideasDatabaseUrl,
    name: 'ideas',
  };
  adminHost = environment.adminHost;
}
