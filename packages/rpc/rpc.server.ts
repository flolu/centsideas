import * as grpc from '@grpc/grpc-js';
import { injectable, interfaces } from 'inversify';

import { MessageBroker } from '@centsideas/event-sourcing';
import { Logger, InternalError } from '@centsideas/utils';

import { loadProtoPackage } from './util';

@injectable()
export class RpcServer {
  isRunning = false;

  private server = new grpc.Server();

  constructor(private logger: Logger, private messageBroker: MessageBroker) {}

  initialize(port: number, host = '0.0.0.0') {
    this.server.bindAsync(
      `${host}:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, listeningPort) => {
        if (err) {
          const errorPayload = this.logger.error(
            err,
            `while binding rpc server (port: ${listeningPort})`,
          );
          this.messageBroker.dispatchError(errorPayload);
          throw err;
        }
        this.logger.info(`rpc server running on ${listeningPort}`);
        this.server.start();
        this.isRunning = true;
      },
    );
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

        if (InternalError.isUnexpected(name))
          callback({ code, details, metadata, stack: error.stack }, null);
        else callback({ code, details, metadata }, null);

        const errorPayload = this.logger.error(error);
        await this.messageBroker.dispatchError(errorPayload);
      }
    };
  }
}

export type RpcServerFactory = (port: number, host?: string) => RpcServer;

export const rpcServerFactory = (context: interfaces.Context): RpcServerFactory => {
  return (port, host) => {
    const rpcServer = context.container.get(RpcServer);
    rpcServer.initialize(port, host);
    return rpcServer;
  };
};
