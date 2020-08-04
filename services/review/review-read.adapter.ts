import {injectable, inject} from 'inversify';

import {RpcClient, RPC_CLIENT_FACTORY, RpcClientFactory} from '@centsideas/rpc';
import {ReviewQueries, ReviewReadService} from '@centsideas/schemas';
import {UserId, IdeaId} from '@centsideas/types';
import {RpcStatus} from '@centsideas/enums';

import {ReviewConfig} from './review.config';

@injectable()
export class ReviewReadAdapter {
  private reviewReadRpc: RpcClient<ReviewQueries.Service> = this.newRpcFactory({
    host: this.config.get('review-read.rpc.host'),
    service: ReviewReadService,
    port: this.config.getNumber('review-read.rpc.port'),
  });

  constructor(
    private config: ReviewConfig,
    @inject(RPC_CLIENT_FACTORY) private newRpcFactory: RpcClientFactory,
  ) {}

  async getByAuthorAndIdea(author: UserId, idea: IdeaId) {
    try {
      return await this.reviewReadRpc.client.getByAuthorAndIdea({
        authorId: author.toString(),
        ideaId: idea.toString(),
        auid: author.toString(),
      });
    } catch (error) {
      if (error.code === RpcStatus.NOT_FOUND) return null;
      throw error;
    }
  }
}
