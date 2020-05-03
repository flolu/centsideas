import * as http from 'http';
import { injectable } from 'inversify';

import { Logger } from '@centsideas/utils';
import {
  RpcServer,
  IReviewCommands,
  CreateReview,
  UpdateReview,
  DeleteReview,
} from '@centsideas/rpc';

import { ReviewsEnvironment } from './reviews.environment';
import { ReviewsHandler } from './reviews.handler';

@injectable()
export class ReviewsServer {
  constructor(
    private env: ReviewsEnvironment,
    private rpcServer: RpcServer,
    private handler: ReviewsHandler,
  ) {
    Logger.info('launch in', this.env.environment, 'mode');
    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    const reviewsCommands = this.rpcServer.loadService('review', 'ReviewCommands');
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
