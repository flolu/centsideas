import * as http from 'http';
import * as path from 'path';
import { injectable } from 'inversify';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import { Logger } from '@centsideas/utils';
import { Dtos, IIdeaState } from '@centsideas/models';
import { IdeasEnvironment } from './ideas.environment';
import { IdeasHandler } from './ideas.handler';

@injectable()
export class IdeasServer {
  private isServerRunning = false;

  constructor(private env: IdeasEnvironment, private handler: IdeasHandler) {
    Logger.info('launch in', this.env.environment, 'mode');
    this.handleHealthchecks();

    const filename = path.join(__dirname, '../../packages/protobuf/idea', 'idea.proto');
    const packageDef = protoLoader.loadSync(filename);
    const grpcObject = grpc.loadPackageDefinition(packageDef);
    const ideaPackage = grpcObject.idea;

    const server = new grpc.Server();
    server.addService((ideaPackage as any).IdeaServiceDefinition.service, {
      create: this.create,
      update: this.update,
      delete: this.delete,
    });

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
  create: grpc.handleUnaryCall<Dtos.ICreateIdeaDto, IIdeaState> = async (call, callback) => {
    if (!call.request) return callback(Error('no payload sent'), null);
    const { userId, title, description } = call.request;
    const created = await this.handler.create(userId, title, description);
    callback(null, created.persistedState);
  };

  update: grpc.handleUnaryCall<Dtos.IUpdateIdeaDto, IIdeaState> = async (call, callback) => {
    if (!call.request) return callback(Error('no payload sent'), null);
    const { userId, title, description, ideaId } = call.request;
    const updated = await this.handler.update(userId, ideaId, title, description);
    callback(null, updated.persistedState);
  };

  delete: grpc.handleUnaryCall<Dtos.IDeleteIdeaDto, IIdeaState> = async (call, callback) => {
    if (!call.request) return callback(Error('no payload sent'), null);
    const { userId, ideaId } = call.request;
    const deleted = await this.handler.delete(userId, ideaId);
    callback(null, deleted.persistedState);
  };

  private handleHealthchecks() {
    http
      .createServer((_req, res) => res.writeHead(this.isServerRunning ? 200 : 500).end())
      .listen(3000);
  }
}
