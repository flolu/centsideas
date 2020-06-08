import {injectable, inject} from 'inversify';
import * as http from 'http';

import {RPC_SERVER_FACTORY, RpcServerFactory} from '@centsideas/rpc';

import {AuthenticationService} from './authentication.service';

@injectable()
export class AuthenticationServer {
  // TODO implement
  constructor(
    private _service: AuthenticationService,
    @inject(RPC_SERVER_FACTORY) private _rpcServerFactory: RpcServerFactory,
  ) {
    http.createServer((_, res) => res.writeHead(200).end()).listen(3000);
  }
}
