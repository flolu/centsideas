import {SchemaService} from '@centsideas/schemas';

export const RPC_METHODS = '__rpcMethods__';

export const RpcMethod = (schemaService: SchemaService) => {
  return function MethodDecorator(
    _target: object,
    methodName: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const metadata = Reflect.getMetadata(RPC_METHODS, schemaService);
    Reflect.defineMetadata(
      RPC_METHODS,
      {...metadata, [methodName]: descriptor.value},
      schemaService,
    );
  };
};
