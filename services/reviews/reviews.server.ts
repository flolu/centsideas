import * as http from 'http';
import { injectable, inject } from 'inversify';

import { Logger } from '@centsideas/utils';
import {
  RpcServer,
  IReviewCommands,
  CreateReview,
  UpdateReview,
  DeleteReview,
  RPC_TYPES,
  RpcServerFactory,
} from '@centsideas/rpc';
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
    @inject(RPC_TYPES.RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    Logger.info('launch in', this.globalEnv.environment, 'mode');
    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    const reviewsCommands = this.rpcServer.loadService('review', 'ReviewCommands');
    // TODO directly add handler function onto here instead of creating helper functions (also in other servcies!)
    this.rpcServer.addService<IReviewCommands>(reviewsCommands, {
      create: this.create,
      update: this.update,
      delete: this.delete,
    });
  }

  create: CreateReview = async ({ ideaId, content, scores, userId }) => {
    const created = await this.handler.create(ideaId, userId, content, scores);
    return created.persistedState;
  };

  update: UpdateReview = async ({ reviewId, content, scores, userId }) => {
    const updated = await this.handler.update(userId, reviewId, content, scores);
    return updated.persistedState;
  };

  delete: DeleteReview = async ({ reviewId, userId }) => {
    const deleted = await this.handler.delete(userId, reviewId);
    return deleted.persistedState;
  };
}
