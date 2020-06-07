import {injectable, inject} from 'inversify';

import {RPC_SERVER_FACTORY, RpcServerFactory} from '@centsideas/rpc';

import {AuthenticationService} from './authentication.service';

@injectable()
export class AuthenticationServer {
  // TODO implement
  constructor(
    private _service: AuthenticationService,
    @inject(RPC_SERVER_FACTORY) private _rpcServerFactory: RpcServerFactory,
  ) {}
}
