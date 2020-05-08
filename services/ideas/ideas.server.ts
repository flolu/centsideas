import * as http from 'http';
import { injectable, inject } from 'inversify';

import { Logger } from '@centsideas/utils';
import { IIdeaCommands, RpcServer, RPC_TYPES, RpcServerFactory } from '@centsideas/rpc';
import { GlobalEnvironment } from '@centsideas/environment';

import { IdeasHandler } from './ideas.handler';
import { IdeasEnvironment } from './ideas.environment';

@injectable()
export class IdeasServer {
  private rpcServer: RpcServer = this.rpcServerFactory(this.env.rpcPort);

  constructor(
    private env: IdeasEnvironment,
    private globalEnv: GlobalEnvironment,
    private handler: IdeasHandler,
    private logger: Logger,
    @inject(RPC_TYPES.RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    this.logger.info('launch in', this.globalEnv.environment, 'mode');
    // TODO make sure worker id is set for unique shortid's https://github.com/dylang/shortid#shortidworkerinteger
    this.logger.info('launch with worker id', process.env.NODE_UNIQUE_ID);

    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    const commandsService = this.rpcServer.loadService('idea', 'IdeaCommands');
    this.rpcServer.addService<IIdeaCommands>(commandsService, {
      create: this.handler.create,
      update: this.handler.update,
      delete: this.handler.delete,
    });
  }
}
