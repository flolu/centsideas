import { injectable } from 'inversify';
import * as grpc from '@grpc/grpc-js';

import { loadProtoPackage } from './util';

@injectable()
export class RpcClient<IClientService = any> {
  private internalRpcClient!: grpc.Client;
  client!: IClientService;

  constructor(
    private host: string,
    private port: number,
    private packageName: string,
    private serviceName: string,
  ) {
    const protoPackage = loadProtoPackage(this.packageName);
    const serviceDefinition = (protoPackage as any)[this.serviceName];
    this.internalRpcClient = new serviceDefinition(
      `${this.host}:${this.port}`,
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
    methodNames.forEach(mn => {
      (this.client as any)[mn] = (payload: any) => {
        return new Promise(resolve => {
          const method: grpc.requestCallback<any> = (this.internalRpcClient as any)[mn](
            payload,
            (err: grpc.ServiceError, response: any) => {
              if (err) throw err;
              resolve(response);
            },
          );
          (this.internalRpcClient as any)[mn].bind(method);
        });
      };
    });
  }
}
