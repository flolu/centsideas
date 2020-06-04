import {injectable, inject} from 'inversify';
import * as http from 'http';

import {RpcServer, RpcServerFactory, RPC_SERVER_FACTORY} from '@centsideas/rpc';
import {IdeaRead, loadProtoService, IdeaReadService} from '@centsideas/schemas';

import {IdeaRepository} from './idea.repository';

@injectable()
export class IdeaReadServer {
  private rpcServer: RpcServer = this.rpcServerFactory();

  constructor(
    private repository: IdeaRepository,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    this.rpcServer.addService<IdeaRead>(loadProtoService(IdeaReadService).service, {
      getById: ({id, userId}) => this.repository.getById(id, userId),
      getAll: async () => {
        const ideas = await this.repository.getAll();
        return {ideas};
      },
      getUnpublished: async ({userId}) => this.repository.getUnpublished(userId),
    });
  }
}
