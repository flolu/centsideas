import {injectable, inject} from 'inversify';

import {RpcServer, RPC_SERVER_FACTORY, RpcServerFactory, RpcMethod} from '@centsideas/rpc';
import {IdeaId, UserId} from '@centsideas/types';
import {IdeaCommandsService, IdeaCommands, GetEvents} from '@centsideas/schemas';
import {ServiceServer} from '@centsideas/utils';

import {IdeaService} from './idea.service';
import {IdeaConfig} from './idea.config';

// FIXME listen for user deletion and remove or anonymize his ideas

@injectable()
export class IdeaServer extends ServiceServer implements IdeaCommands.Service {
  private rpcServer: RpcServer = this.rpcServerFactory({
    services: [IdeaCommandsService],
    handlerClassInstance: this,
    port: this.config.getNumber('idea.rpc.port'),
  });

  constructor(
    private service: IdeaService,
    private config: IdeaConfig,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    super();
  }

  @RpcMethod(IdeaCommandsService)
  async create({userId}: IdeaCommands.CreateIdea) {
    const upsertedId = await this.service.create(IdeaId.generate(), userId);
    return {id: upsertedId};
  }

  @RpcMethod(IdeaCommandsService)
  rename({id, userId, title}: IdeaCommands.RenameIdea) {
    return this.service.rename(id, userId, title);
  }

  @RpcMethod(IdeaCommandsService)
  editDescription({id, userId, description}: IdeaCommands.EditIdeaDescription) {
    return this.service.editDescription(id, userId, description);
  }

  @RpcMethod(IdeaCommandsService)
  updateTags({id, userId, tags}: IdeaCommands.UpdateIdeaTags) {
    return this.service.updateTags(id, userId, tags);
  }

  @RpcMethod(IdeaCommandsService)
  publish({id, userId}: IdeaCommands.PublishIdea) {
    return this.service.publish(id, userId);
  }

  @RpcMethod(IdeaCommandsService)
  delete({id, userId}: IdeaCommands.DeleteIdea) {
    return this.service.delete(id, userId);
  }

  @RpcMethod(IdeaCommandsService)
  async getEventsByUserId({userId}: IdeaCommands.GetByUserId) {
    const events = await this.service.getEventsByUser(UserId.fromString(userId));
    return {events};
  }

  @RpcMethod(IdeaCommandsService)
  async getEvents({after}: GetEvents) {
    const events = await this.service.getEvents(after);
    return {events};
  }

  async healthcheck() {
    return this.rpcServer.isRunning;
  }

  async shutdownHandler() {
    await this.rpcServer.disconnect();
  }
}
