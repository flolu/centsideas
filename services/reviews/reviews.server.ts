import * as http from 'http';
import { injectable, inject } from 'inversify';

import { Logger } from '@centsideas/utils';
import { RpcServer, IReviewCommands, RPC_TYPES, RpcServerFactory } from '@centsideas/rpc';
import { GlobalEnvironment } from '@centsideas/environment';

import { ReviewsHandler } from './reviews.handler';
import { ReviewsEnvironment } from './reviews.environment';

@injectable()
export class ReviewsServer {
  private rpcServer: RpcServer = this.rpcServerFactory(this.env.rpcPort);

  constructor(
    private env: ReviewsEnvironment,
    private globalEnv: GlobalEnvironment,
    private handler: ReviewsHandler,
    private logger: Logger,
    @inject(RPC_TYPES.RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    this.logger.info('launch in', this.globalEnv.environment, 'mode');

    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    const reviewsCommands = this.rpcServer.loadService('review', 'ReviewCommands');
    this.rpcServer.addService<IReviewCommands>(reviewsCommands, {
      create: this.handler.create,
      update: this.handler.update,
      delete: this.handler.delete,
    });
  }
}
