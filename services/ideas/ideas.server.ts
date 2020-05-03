import * as http from 'http';
import { injectable } from 'inversify';

import { Logger } from '@centsideas/utils';
import { IIdeaCommands, RpcServer, CreateIdea, DeleteIdea, UpdateIdea } from '@centsideas/rpc';

import { IdeasEnvironment } from './ideas.environment';
import { IdeasHandler } from './ideas.handler';

@injectable()
export class IdeasServer {
  constructor(
    private env: IdeasEnvironment,
    private handler: IdeasHandler,
    private rpcServer: RpcServer,
  ) {
    Logger.info('launch in', this.env.environment, 'mode');
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
