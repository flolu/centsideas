import * as grpc from '@grpc/grpc-js';
import {injectable, interfaces} from 'inversify';

import {loadProtoPackage} from './util';

@injectable()
export class RpcClient<IClientService = any> {
  private internalRpcClient!: grpc.Client;
  client!: IClientService;

  initialize(host: string, name: string, service: string, port: number) {
    const protoPackage = loadProtoPackage(name);
    const serviceDefinition = (protoPackage as any)[service];
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
    this.client = {} as any;
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

export type RpcClientFactory = (
  host: string,
  protoFilePath: string,
  serviceName: string,
  port?: number,
) => RpcClient<any>;

export const rpcClientFactory = (context: interfaces.Context): RpcClientFactory => {
  return (host, protoFilePath, serviceName, port = 40000) => {
    const rpcClient = context.container.get(RpcClient);
    rpcClient.initialize(host, protoFilePath, serviceName, port);
    return rpcClient;
  };
};
