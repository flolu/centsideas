import {injectable} from 'inversify';

import {SchemaService, loadProtoService} from '@centsideas/schemas';

@injectable()
export class RpcClientMock<T = any> {
  client: T = {} as any;

  initialize(_host: string, service: SchemaService) {
    const serviceDefinition = loadProtoService(service);
    Object.keys(serviceDefinition.service).forEach(
      methodName =>
        ((this.client as any)[methodName] = () => {
          return null;
        }),
    );
  }
}
