import {injectable, inject} from 'inversify';
import * as http from 'http';

import {RpcServer, RPC_TYPES, RpcServerFactory} from '@centsideas/rpc';
import {GlobalEnvironment} from '@centsideas/environment';
import {Logger} from '@centsideas/utils';

// import {IdeaService} from './idea.service';
import {IdeaEnvironment} from './idea.environment';

@injectable()
export class IdeaServer {
  private rpcServer: RpcServer = this.rpcServerFactory(this.env.rpcPort);

  constructor(
    private env: IdeaEnvironment,
    private globalEnv: GlobalEnvironment,
    // private service: IdeaService,
    private logger: Logger,
    @inject(RPC_TYPES.RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    this.logger.info('launch in', this.globalEnv.environment, 'mode');

    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    // TODO listen for rpc
  }
}
