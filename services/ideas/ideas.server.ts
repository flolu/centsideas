import * as http from 'http';
import { injectable } from 'inversify';

import { Logger } from '@centsideas/utils';
import { IIdeaCommandsImplementation, RpcServer } from '@centsideas/rpc';

import { IdeasEnvironment } from './ideas.environment';
import { IdeasHandler } from './ideas.handler';

@injectable()
export class IdeasServer {
  private isServerRunning = false;

  constructor(
    private env: IdeasEnvironment,
    private handler: IdeasHandler,
    private rpcServer: RpcServer,
  ) {
    Logger.info('launch in', this.env.environment, 'mode');
    this.handleHealthchecks();

    const commandsService = this.rpcServer.loadService('idea', 'IdeaCommands');
    this.rpcServer.addService(commandsService, this.commandsImplementation);
  }

  // TODO error handling
  commandsImplementation: IIdeaCommandsImplementation = {
    create: async (call, callback) => {
      if (!call.request) return callback(Error('no payload sent'), null);
      const { userId, title, description } = call.request;
      const created = await this.handler.create(userId, title, description);
      callback(null, created.persistedState);
    },
    update: async (call, callback) => {
      if (!call.request) return callback(Error('no payload sent'), null);
      const { userId, title, description, ideaId } = call.request;
      const updated = await this.handler.update(userId, ideaId, title, description);
      callback(null, updated.persistedState);
    },
    delete: async (call, callback) => {
      if (!call.request) return callback(Error('no payload sent'), null);
      const { userId, ideaId } = call.request;
      const deleted = await this.handler.delete(userId, ideaId);
      callback(null, deleted.persistedState);
    },
  };

  private handleHealthchecks() {
    http
      .createServer((_req, res) => res.writeHead(this.isServerRunning ? 200 : 500).end())
      .listen(3000);
  }
}
