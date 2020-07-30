import {injectable, inject} from 'inversify';

import {ServiceServer} from '@centsideas/utils';
import {RpcServer, RPC_SERVER_FACTORY, RpcServerFactory} from '@centsideas/rpc';
import {ReviewCommandsService} from '@centsideas/schemas';

import {ReviewService} from './review.service';
import {ReviewConfig} from './review.config';

@injectable()
export class ReviewServer extends ServiceServer {
  private rpcServer: RpcServer = this.rpcServerFactory({
    services: [ReviewCommandsService],
    handlerClassInstance: this,
    port: this.config.getNumber('review.rpc.port'),
  });

  constructor(
    private service: ReviewService,
    private config: ReviewConfig,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    super();
  }

  async healthcheck() {
    return this.rpcServer.isRunning;
  }

  async shutdownHandler() {
    await this.rpcServer.disconnect();
  }
}
