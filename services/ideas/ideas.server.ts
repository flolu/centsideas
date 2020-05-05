import * as http from 'http';
import { injectable, inject } from 'inversify';

import { Logger } from '@centsideas/utils';
import {
  IIdeaCommands,
  RpcServer,
  CreateIdea,
  DeleteIdea,
  UpdateIdea,
  RPC_TYPES,
  RpcServerFactory,
} from '@centsideas/rpc';
import { GlobalEnvironment } from '@centsideas/environment';

import { IdeasHandler } from './ideas.handler';
import { IdeasEnvironment } from './ideas.environment';

@injectable()
export class IdeasServer {
  private rpcServer: RpcServer = this.rpcServerFactory(this.env.rpcPort);

  constructor(
    private env: IdeasEnvironment,
    private globalEnv: GlobalEnvironment,
    private handler: IdeasHandler,
    @inject(RPC_TYPES.RPC_SERVER_FACTORY) private rpcServerFactory: RpcServerFactory,
  ) {
    Logger.info('launch in', this.globalEnv.environment, 'mode');
    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    const commandsService = this.rpcServer.loadService('idea', 'IdeaCommands');
    this.rpcServer.addService<IIdeaCommands>(commandsService, {
      create: this.create,
      update: this.update,
      delete: this.delete,
    });
  }

  create: CreateIdea = async ({ userId, title, description }) => {
    const created = await this.handler.create(userId, title, description);
    return created.persistedState;
  };

  update: UpdateIdea = async ({ userId, title, description, ideaId }) => {
    const updated = await this.handler.update(userId, ideaId, title, description);
    return updated.persistedState;
  };

  delete: DeleteIdea = async ({ userId, ideaId }) => {
    const deleted = await this.handler.delete(userId, ideaId);
    return deleted.persistedState;
  };
}
