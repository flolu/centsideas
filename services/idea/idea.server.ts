import {injectable, inject} from 'inversify';
import * as http from 'http';

import {RpcServer, RPC_TYPES, RpcServerFactory, IdeaCommands} from '@centsideas/rpc';
import {GlobalEnvironment} from '@centsideas/environment';
import {Logger} from '@centsideas/utils';

import {IdeaService} from './idea.service';
import {IdeaEnvironment} from './idea.environment';
import {IdeaId} from '@centsideas/types';

@injectable()
export class IdeaServer {
  private rpcServer: RpcServer = this.rpcServerFactory();

  constructor(
    private env: IdeaEnvironment,
    private globalEnv: GlobalEnvironment,
    private service: IdeaService,
    private logger: Logger,
    @inject(RPC_TYPES.RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    this.logger.info('launch in', this.globalEnv.environment, 'mode');

    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    // TODO error handling (also retry on concurrency issue)
    const commandsService = this.rpcServer.loadService('idea', 'IdeaCommands');
    this.rpcServer.addService<IdeaCommands>(commandsService, {
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
  }
}
