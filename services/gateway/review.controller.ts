import * as express from 'express';
import {interfaces, controller, httpPut, httpPost, httpGet} from 'inversify-express-utils';
import {inject} from 'inversify';

import {ApiEndpoints} from '@centsideas/enums';
import {RpcClient, RPC_CLIENT_FACTORY, RpcClientFactory} from '@centsideas/rpc';
import {
  ReviewCommands,
  ReviewQueries,
  ReviewReadService,
  ReviewCommandsService,
} from '@centsideas/schemas';

import {GatewayConfig} from './gateway.config';
import {AuthMiddleware, OptionalAuthMiddleware} from './auth.middleware';

@controller(`/${ApiEndpoints.Review}`)
export class ReviewController implements interfaces.Controller {
  private write: RpcClient<ReviewCommands.Service> = this.rpcFactory({
    host: this.config.get('review.rpc.host'),
    service: ReviewCommandsService,
    port: this.config.getNumber('review.rpc.port'),
  });
  private read: RpcClient<ReviewQueries.Service> = this.rpcFactory({
    host: this.config.get('review-read.rpc.host'),
    service: ReviewReadService,
    port: this.config.getNumber('review-read.rpc.port'),
  });

  constructor(
    private config: GatewayConfig,
    @inject(RPC_CLIENT_FACTORY) private rpcFactory: RpcClientFactory,
  ) {}

  @httpPost('', AuthMiddleware)
  async create(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {ideaId} = req.body;
    const result = await this.write.client.create({ideaId, userId});
    return result;
  }

  @httpPut('/:id/content', AuthMiddleware)
  editContent(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    const {content} = req.body;
    return this.write.client.editContent({id, userId, content});
  }

  @httpPut('/:id/score', AuthMiddleware)
  changeScore(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    const {control, entry, need, time, scale} = req.body;
    const score = {control, entry, need, time, scale};
    return this.write.client.changeScore({id, userId, score});
  }

  @httpPut('/:id/publish', AuthMiddleware)
  publish(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {id} = req.params;
    return this.write.client.publish({id, userId});
  }

  @httpGet('', OptionalAuthMiddleware)
  getReviews(req: express.Request, res: express.Response) {
    const {userId} = res.locals;
    const {ideaId, authorId} = req.query;
    if (ideaId && authorId)
      return this.read.client.getByAuthorAndIdea({
        authorId: authorId.toString(),
        ideaId: ideaId.toString(),
        auid: userId,
      });

    if (ideaId)
      return this.read.client.getByIdeaId({
        ideaId: ideaId.toString(),
        auid: userId,
      });

    if (authorId)
      return this.read.client.getByAuthor({
        authorId: authorId.toString(),
        auid: userId,
      });

    if (!ideaId && !authorId) return this.read.client.getAll();
  }
}
