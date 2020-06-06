import {injectable, inject} from 'inversify';

import {RpcClient, RPC_CLIENT_FACTORY, RpcClientFactory} from '@centsideas/rpc';
import {UserId} from '@centsideas/types';
import {IdeaReadQueries, IdeaReadService} from '@centsideas/schemas';
import {RpcStatus} from '@centsideas/enums';

import {IdeaConfig} from './idea.config';

@injectable()
export class IdeaReadAdapter {
  private ideaReadRpc: RpcClient<IdeaReadQueries.Service> = this.newRpcFactory(
    this.config.get('idea-read.rpc.host'),
    IdeaReadService,
    Number(this.config.get('idea-read.rpc.port')),
  );

  constructor(
    private config: IdeaConfig,
    @inject(RPC_CLIENT_FACTORY) private newRpcFactory: RpcClientFactory,
  ) {}

  async getUnpublishedIdea(user: UserId) {
    try {
      return await this.ideaReadRpc.client.getUnpublished({userId: user.toString()});
    } catch (error) {
      if (error.code === RpcStatus.NOT_FOUND) return null;
      else throw error;
    }
  }
}
