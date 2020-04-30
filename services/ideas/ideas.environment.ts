import { injectable } from 'inversify';

import { Environments } from '@centsideas/enums';

@injectable()
export class IdeasEnvironment {
  environment: Environments = process.env.ENV as Environments;
  port = 3000;
  rpc = {
    host: '0.0.0.0',
    port: process.env.IDEAS_RPC_PORT!,
  };
  database = {
    url: process.env.IDEAS_DATABASE_URL!,
    name: 'ideas',
  };
  adminHost = process.env.ADMIN_SERVICE_HOST!;
}
