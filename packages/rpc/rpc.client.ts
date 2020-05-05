import * as grpc from '@grpc/grpc-js';
import { injectable, interfaces } from 'inversify';

import { loadProtoPackage } from './util';

@injectable()
export class RpcClient<IClientService = any> {
  private internalRpcClient!: grpc.Client;
  client!: IClientService;

  initialize(host: string, port: number, packageName: string, serviceName: string) {
    const protoPackage = loadProtoPackage(packageName);
    const serviceDefinition = (protoPackage as any)[serviceName];
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
  port: number,
  packageName: string,
  serviceName: string,
) => RpcClient<any>;

export const rpcClientFactory = (context: interfaces.Context): RpcClientFactory => {
  return (host, port, packageName, serviceName) => {
    const rpcClient = context.container.get(RpcClient);
    rpcClient.initialize(host, port, packageName, serviceName);
    return rpcClient;
  };
};
