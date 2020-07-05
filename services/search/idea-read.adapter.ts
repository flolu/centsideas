import {injectable, inject} from 'inversify';

import {IdeaId} from '@centsideas/types';
import {RpcClient, RPC_CLIENT_FACTORY, RpcClientFactory} from '@centsideas/rpc';
import {IdeaReadQueries, IdeaReadService} from '@centsideas/schemas';

import {SearchConfig} from './search.config';

@injectable()
export class IdeaReadAdapter {
  private ideaReadRpc: RpcClient<IdeaReadQueries.Service> = this.newRpcFactory({
    host: this.config.get('idea-read.rpc.host'),
    service: IdeaReadService,
    port: this.config.getNumber('idea-read.rpc.port'),
  });

  constructor(
    private config: SearchConfig,
    @inject(RPC_CLIENT_FACTORY) private newRpcFactory: RpcClientFactory,
  ) {}

  async getById(idea: IdeaId) {
    try {
      return await this.ideaReadRpc.client.getById({id: idea.toString()});
    } catch (error) {
      throw error;
      // TODO don't achknowledge kafka message if error
    }
  }
}
