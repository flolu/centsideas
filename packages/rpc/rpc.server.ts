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

  addService<IServiceImplementation>(
    service: grpc.ServiceDefinition,
    implementation: IServiceImplementation,
  ) {
    const grpcImpl = this.convertToGrpcImplementation(implementation);
    this.server.addService(service, grpcImpl);
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

  /**
   * Converts promise based implementation methods into the grpc callback
   * based implementation methods
   */
  private convertToGrpcImplementation(implementation: any): grpc.UntypedServiceImplementation {
    const grpcImpl: grpc.UntypedServiceImplementation = {};
    Object.keys(implementation).forEach(key => {
      const handler = implementation[key];
      (grpcImpl as any)[key] = this.convertPromiseToCallback(handler as any);
    });
    return grpcImpl;
  }

  private convertPromiseToCallback(
    handler: (payload: any) => Promise<any>,
  ): grpc.handleUnaryCall<any, any> {
    return async (call, callback) => {
      const response = await handler(call.request).catch(err => callback(err, null));
      callback(null, response);
    };
  }
}
