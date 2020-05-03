import * as grpc from '@grpc/grpc-js';
import { injectable } from 'inversify';

import { Logger } from '@centsideas/utils';
import { loadProtoPackage } from './util';

@injectable()
export class RpcServer {
  private server = new grpc.Server();

  constructor(private host: string, private port: number) {
    this.startServer();
  }

  // FIXME better type experience for `implementation`
  addService(service: grpc.ServiceDefinition, implementation: any) {
    this.server.addService(service, implementation);
  }

  loadService(packageName: string, serviceName: string): grpc.ServiceDefinition {
    const protoPackage = loadProtoPackage(packageName);
    return (protoPackage as any)[serviceName].service;
  }

  private startServer() {
    this.server.bindAsync(
      `${this.host}:${this.port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          Logger.error(err, `while binding rpc server (port: ${port})`);
          throw err;
        }
        Logger.info(`rpc server running on ${port}`);
        this.server.start();
      },
    );
  }
}
