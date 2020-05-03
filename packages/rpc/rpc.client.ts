import { injectable } from 'inversify';
import * as grpc from '@grpc/grpc-js';

import { loadProtoPackage } from './util';

@injectable()
export class RpcClient<IClientService = any> {
  client!: IClientService;

  constructor(
    private host: string,
    private port: number,
    private packageName: string,
    private serviceName: string,
  ) {
    const protoPackage = loadProtoPackage(this.packageName);
    this.client = new (protoPackage as any)[this.serviceName](
      `${this.host}:${this.port}`,
      grpc.credentials.createInsecure(),
    );
  }
}
