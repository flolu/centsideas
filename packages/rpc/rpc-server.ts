import * as grpc from '@grpc/grpc-js';
import {injectable, interfaces} from 'inversify';
import * as asyncRetry from 'async-retry';

import {Logger, UnexpectedException} from '@centsideas/utils';
import {EventSourcingErrorNames, RpcStatus} from '@centsideas/enums';
import {SchemaService, loadProtoService} from '@centsideas/schemas';

import {RPC_METHODS} from './rpc-method';

@injectable()
export class RpcServer {
  isRunning = false;

  private server = new grpc.Server();
  private readonly defaultPort = 40000;
  private readonly host = '0.0.0.0';

  constructor(private logger: Logger) {}

  initialize(
    services: SchemaService[],
    handlerClassInstance: object,
    port: number = this.defaultPort,
  ) {
    this.server.bindAsync(`${this.host}:${port}`, grpc.ServerCredentials.createInsecure(), err => {
      if (err) throw new UnexpectedException(`while starting rpc server`, {port});
      this.server.start();
      this.isRunning = true;
    });

    services.forEach(s => this.addService(s, handlerClassInstance));
  }

  private addService(service: SchemaService, methodsContainingClassInstance: object) {
    const methods = Reflect.getMetadata(RPC_METHODS, service);
    const implementation: Record<string, any> = {};

    if (!methods)
      throw new Error(`Please provide at least one @RpcMethod for ${service.service} service`);
    Object.keys(methods).forEach(method => {
      implementation[method] = methods[method].bind(methodsContainingClassInstance);
    });

    const grpcImpl = this.convertToGrpcImplementation(implementation);
    this.server.addService(loadProtoService(service).service, grpcImpl);
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
        await asyncRetry(
          async bail => {
            const response = await handler(call.request).catch(err => {
              /**
               * Retry the command twice if the optimistic concurrency
               * error is thrown by the event store
               */
              if (err.name && err.name === EventSourcingErrorNames.OptimisticConcurrencyIssue) {
                this.logger.warn('concurrency issue... retry');
                throw err;
              }
              bail(err);
            });
            callback(null, response);
          },
          {retries: 2, minTimeout: 50},
        );
      } catch (error) {
        const name = error.name;
        const details = error.message;
        const code = error.code || RpcStatus.UNKNOWN;
        const metadata = new grpc.Metadata();

        if (name) metadata.add('name', name);

        if (code === RpcStatus.UNKNOWN)
          callback({code, details, metadata, stack: error.stack}, null);
        else callback({code, details, metadata}, null);

        this.logger.error(error);
        const _data = {
          name,
          code,
          timestamp: error.timestamp,
          message: error.message,
          details: error.details,
          stack: error.stack,
        };
        //  FIXME send error to error service
        // await this.messageBroker.dispatchError(errorPayload);
      }
    };
  }
}

export type RpcServerFactory = (options: {
  services: SchemaService[];
  handlerClassInstance: object;
  port?: number;
}) => RpcServer;
export const rpcServerFactory = (context: interfaces.Context): RpcServerFactory => {
  return ({services, handlerClassInstance, port}) => {
    const rpcServer = context.container.get(RpcServer);
    rpcServer.initialize(services, handlerClassInstance, port);
    return rpcServer;
  };
};
