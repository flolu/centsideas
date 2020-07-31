import {injectable, inject} from 'inversify';

import {ServiceServer} from '@centsideas/utils';
import {ReviewQueries, ReviewReadService} from '@centsideas/schemas';
import {RpcServer, RPC_SERVER_FACTORY, RpcServerFactory, RpcMethod} from '@centsideas/rpc';
import {IdeaId, UserId} from '@centsideas/types';

import {ReviewProjector} from './review.projector';
import {ReviewRepository} from './review.repository';

@injectable()
export class ReviewReadServer extends ServiceServer implements ReviewQueries.Service {
  private rpcServer: RpcServer = this.rpcServerFactory({
    services: [ReviewReadService],
    handlerClassInstance: this,
  });

  constructor(
    private repository: ReviewRepository,
    private projector: ReviewProjector,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    super();
  }

  @RpcMethod(ReviewReadService)
  getByIdeaId({ideaId, auid}: ReviewQueries.GetByIdeaId) {
    return this.repository.getByIdea(
      IdeaId.fromString(ideaId),
      auid ? UserId.fromString(auid) : undefined,
    );
  }

  @RpcMethod(ReviewReadService)
  getByAuthorAndIdea({ideaId, auid}: ReviewQueries.GetByAuthorAndIdea) {
    return this.repository.getByIdeaAndAuthor(IdeaId.fromString(ideaId), UserId.fromString(auid));
  }

  @RpcMethod(ReviewReadService)
  getByAuthor({authorId, auid}: ReviewQueries.GetByAuthor) {
    return this.repository.getByAuthor(
      UserId.fromString(authorId),
      auid ? UserId.fromString(auid) : undefined,
    );
  }

  async healthcheck() {
    return this.rpcServer.isRunning && this.projector.connected;
  }

  async shutdownHandler() {
    await Promise.all([this.projector.shutdown(), this.rpcServer.disconnect()]);
  }
}
