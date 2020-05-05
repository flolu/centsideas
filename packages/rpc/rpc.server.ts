import * as grpc from '@grpc/grpc-js';
import { injectable } from 'inversify';

import { Logger } from '@centsideas/utils';

import { loadProtoPackage } from './util';

// TODO factory

@injectable()
export class RpcServer {
  isRunning = false;

  private server = new grpc.Server();

  constructor(private port: number, private host = '0.0.0.0') {
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
        this.isRunning = true;
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
      try {
        const response = await handler(call.request);
        callback(null, response);
      } catch (error) {
        const name = error.name;
        const details = error.message;
        const code = error.code || grpc.status.UNKNOWN;

        const metadata = new grpc.Metadata();
        if (error.name) metadata.add('name', error.name);

        if (!name || name?.toLowerCase() === 'error' || name?.includes('unexpected')) {
          Logger.error(error);
          callback({ code, details, metadata, stack: error.stack }, null);
        }

        // TODO maybe also send expected errors to admin?!
        callback({ code, details, metadata }, null);
      }
    };
  }
}
