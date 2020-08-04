import {inject, injectable} from 'inversify';

import {RpcClient, RPC_CLIENT_FACTORY, RpcClientFactory} from '@centsideas/rpc';
import {IdeaReadQueries, IdeaReadService} from '@centsideas/schemas';
import {IdeaId} from '@centsideas/types';

import {ReviewConfig} from './review.config';
import {RpcStatus} from '@centsideas/enums';

@injectable()
export class IdeaReadAdapter {
  private ideaReadRpc: RpcClient<IdeaReadQueries.Service> = this.newRpcFactory({
    host: this.config.get('idea-read.rpc.host'),
    service: IdeaReadService,
    port: this.config.getNumber('idea-read.rpc.port'),
  });

  constructor(
    private config: ReviewConfig,
    @inject(RPC_CLIENT_FACTORY) private newRpcFactory: RpcClientFactory,
  ) {}

  async getPublicIdeaById(idea: IdeaId) {
    try {
      return await this.ideaReadRpc.client.getById({id: idea.toString()});
    } catch (error) {
      if (error.code === RpcStatus.NOT_FOUND) return null;
      throw error;
    }
  }
}
