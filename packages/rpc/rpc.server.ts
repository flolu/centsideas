import * as grpc from '@grpc/grpc-js';
import {injectable, interfaces, inject} from 'inversify';
import * as asyncRetry from 'async-retry';

import {Logger, UTILS_TYPES, UnexpectedException} from '@centsideas/utils';
import {EventSourcingErrorNames, RpcStatus} from '@centsideas/enums';

@injectable()
export class RpcServer {
  isRunning = false;

  private server = new grpc.Server();

  constructor(private logger: Logger, @inject(UTILS_TYPES.SERVICE_NAME) private service: string) {}

  initialize(port: number = 40000, host = '0.0.0.0') {
    this.server.bindAsync(
      `${host}:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, listeningPort) => {
        // TODO where are such errors handled? ...maybe in process.on("uncaughtException")
        if (err)
          throw new UnexpectedException(`while starting rpc server`, {
            port,
            host,
            service: this.service,
          });
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
              if (err.name && err.name === EventSourcingErrorNames.OptimisticConcurrencyIssue)
                throw err;
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
          service: this.service,
        };
        //  TODO send error to error service
        // await this.messageBroker.dispatchError(errorPayload);
      }
    };
  }
}

export type RpcServerFactory = (port?: number, host?: string) => RpcServer;
export const rpcServerFactory = (context: interfaces.Context): RpcServerFactory => {
  return (port, host) => {
    const rpcServer = context.container.get(RpcServer);
    rpcServer.initialize(port, host);
    return rpcServer;
  };
};
