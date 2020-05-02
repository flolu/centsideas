import * as http from 'http';
import * as path from 'path';
import { injectable } from 'inversify';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import { Logger } from '@centsideas/utils';
import { IIdeaCommandsImplementation } from '@centsideas/rpc';
import { IdeasEnvironment } from './ideas.environment';
import { IdeasHandler } from './ideas.handler';

@injectable()
export class IdeasServer {
  private readonly protoRootPath = path.resolve(__dirname, '../../', 'packages', 'rpc');
  private readonly ideaCommandsProto = path.join(this.protoRootPath, 'idea', 'idea-commands.proto');
  private isServerRunning = false;

  constructor(private env: IdeasEnvironment, private handler: IdeasHandler) {
    Logger.info('launch in', this.env.environment, 'mode');
    this.handleHealthchecks();

    const packageDef = protoLoader.loadSync(this.ideaCommandsProto);
    const grpcObject = grpc.loadPackageDefinition(packageDef);
    const ideaCommands = grpcObject.ideaCommands;
    const server = new grpc.Server();

    server.addService(
      (ideaCommands as any).IdeaCommands.service,
      this.commandsImplementation as any,
    );

    // TODO rpc package as abstraction
    server.bindAsync(
      `${this.env.rpc.host}:${this.env.rpc.port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) Logger.error(err, 'while binding server');
        else Logger.info('proto server running ', port);
        this.isServerRunning = true;

        server.start();
      },
    );
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
