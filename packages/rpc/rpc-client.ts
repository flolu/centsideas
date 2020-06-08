import * as grpc from '@grpc/grpc-js';
import {injectable, interfaces} from 'inversify';

import {SchemaService, loadProtoService} from '@centsideas/schemas';

@injectable()
export class RpcClient<T = any> {
  client: T = {} as any;

  private readonly defaultPort = 40000;
  private internalRpcClient!: grpc.Client;

  initialize(host: string, service: SchemaService, port: number = this.defaultPort) {
    const serviceDefinition = loadProtoService(service);
    this.internalRpcClient = new serviceDefinition(
      `${host}:${port}`,
      grpc.credentials.createInsecure(),
    );

    this.registerMethods(Object.keys(serviceDefinition.service));
  }

  /**
   * Creates wrappers for grpc unary calls that allows to use
   * promises instead of the default callback
   */
  private registerMethods(methodNames: string[]) {
    methodNames.forEach(methodName => {
      (this.client as any)[methodName] = (payload: any) => {
        return new Promise((resolve, reject) => {
          const method: grpc.requestCallback<any> = (this.internalRpcClient as any)[methodName](
            payload,
            (err: grpc.ServiceError, response: any) => {
              if (err) reject(err);
              resolve(response);
            },
          );
          (this.internalRpcClient as any)[methodName].bind(method);
        });
      };
    });
  }
}

export type RpcClientFactory = (options: {
  host: string;
  service: SchemaService;
  port?: number;
}) => RpcClient<any>;

export const rpcClientFactory = (context: interfaces.Context): RpcClientFactory => {
  return ({host, service, port}) => {
    const rpcClient = context.container.get(RpcClient);
    rpcClient.initialize(host, service, port);
    return rpcClient;
  };
};
