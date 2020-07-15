import {injectable, inject} from 'inversify';

import {RpcServer, RpcServerFactory, RPC_SERVER_FACTORY, RpcMethod} from '@centsideas/rpc';
import {IdeaReadService, IdeaReadQueries} from '@centsideas/schemas';
import {IdeaId, UserId} from '@centsideas/types';
import {ServiceServer} from '@centsideas/utils';

import {IdeaRepository} from './idea.repository';
import {IdeaProjector} from './idea.projector';

@injectable()
export class IdeaReadServer extends ServiceServer implements IdeaReadQueries.Service {
  private rpcServer: RpcServer = this.rpcServerFactory({
    services: [IdeaReadService],
    handlerClassInstance: this,
  });

  constructor(
    private repository: IdeaRepository,
    private projector: IdeaProjector,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    super();
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

  async healthcheck() {
    return this.rpcServer.isRunning && this.projector.connected;
  }

  async shutdownHandler() {
    await Promise.all([this.projector.shutdown(), this.rpcServer.disconnect()]);
  }
}
