import {injectable, inject} from 'inversify';
import * as http from 'http';

import {RpcServer, RpcServerFactory, RPC_SERVER_FACTORY, RpcMethod} from '@centsideas/rpc';
import {IdeaReadService, IdeaReadQueries} from '@centsideas/schemas';
import {IdeaId, UserId} from '@centsideas/types';

import {IdeaRepository} from './idea.repository';
import {IdeaProjector} from './idea.projector';

@injectable()
export class IdeaReadServer implements IdeaReadQueries.Service {
  private rpcServer: RpcServer = this.rpcServerFactory({
    services: [IdeaReadService],
    handlerClassInstance: this,
  });

  constructor(
    private repository: IdeaRepository,
    private _projector: IdeaProjector,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);
  }

  @RpcMethod(IdeaReadService)
  getById({id, userId}: IdeaReadQueries.GetBydId) {
    return this.repository.getById(
      IdeaId.fromString(id),
      userId ? UserId.fromString(userId) : undefined,
    );
  }

  @RpcMethod(IdeaReadService)
  async getAll() {
    const ideas = await this.repository.getAll();
    return {ideas};
  }

  @RpcMethod(IdeaReadService)
  getUnpublished({userId}: IdeaReadQueries.GetUnpublished) {
    return this.repository.getUnpublished(UserId.fromString(userId));
  }

  @RpcMethod(IdeaReadService)
  async getAllByUserId({userId, privates}: IdeaReadQueries.GetAllByUserId) {
    const ideas = await this.repository.getAllByUserId(UserId.fromString(userId), privates);
    return {ideas};
  }
}
