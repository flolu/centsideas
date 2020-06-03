import {injectable, inject} from 'inversify';
import * as http from 'http';

import {RpcServer, RPC_SERVER_FACTORY, RpcServerFactory} from '@centsideas/rpc';
import {IdeaId} from '@centsideas/types';
import {loadProtoService, IdeaCommandsService, IdeaCommands} from '@centsideas/schemas';

import {IdeaService} from './idea.service';

@injectable()
export class IdeaServer {
  private rpcServer: RpcServer = this.rpcServerFactory();

  constructor(
    private service: IdeaService,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    // TODO nicer implementation with @Decorators like (https://docs.nestjs.com/microservices/grpc) would be appreciated
    // problem with metadata reflection: https://stackoverflow.com/questions/62172254
    this.rpcServer.addService<IdeaCommands>(loadProtoService(IdeaCommandsService).service, {
      create: async ({userId}) => {
        const id = IdeaId.generate();
        await this.service.create(id, userId);
        return {id: id.toString()};
      },
      rename: ({id, userId, title}) => this.service.rename(id, userId, title),
      editDescription: ({id, userId, description}) =>
        this.service.editDescription(id, userId, description),
      updateTags: ({id, userId, tags}) => this.service.updateTags(id, userId, tags),
      publish: ({id, userId}) => this.service.publish(id, userId),
      delete: ({id, userId}) => this.service.delete(id, userId),
      getEvents: async ({from}) => {
        const events = await this.service.getEvents(from);
        return {events};
      },
    });
  }
}
