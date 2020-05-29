import {injectable, inject} from 'inversify';
import * as http from 'http';

import {RpcServer, RPC_SERVER_FACTORY, RpcServerFactory} from '@centsideas/rpc';
import {GlobalEnvironment} from '@centsideas/environment';
import {Logger} from '@centsideas/utils';
import {IdeaId} from '@centsideas/types';
import {
  loadProtoService,
  IdeaEventStoreService,
  IdeaEventStore,
  IdeaCommandsService,
  IdeaCommands,
} from '@centsideas/schemas';

import {IdeaService} from './idea.service';
import {IdeaEnvironment} from './idea.environment';

@injectable()
export class IdeaServer {
  private rpcServer: RpcServer = this.rpcServerFactory();
  private rpcEventStoreServer: RpcServer = this.rpcServerFactory(this.env.ideaEventStoreRpcPort);

  constructor(
    private globalEnv: GlobalEnvironment,
    private env: IdeaEnvironment,
    private service: IdeaService,
    private logger: Logger,
    @inject(RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    this.logger.info('launch in', this.globalEnv.environment, 'mode');

    http
      .createServer((_, res) =>
        res
          .writeHead(this.rpcServer.isRunning && this.rpcEventStoreServer.isRunning ? 200 : 500)
          .end(),
      )
      .listen(3000);

    // TODO nicer implementation with @Decorators like (https://docs.nestjs.com/microservices/grpc) would be appreciated
    // TODO error handling (also retry on concurrency issue)
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
    });

    this.rpcEventStoreServer.addService<IdeaEventStore>(
      loadProtoService(IdeaEventStoreService).service,
      {
        getEvents: async ({from}) => {
          const events = await this.service.getEvents(from);
          return {events};
        },
      },
    );
  }
}
