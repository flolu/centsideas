import * as path from 'path';
import * as protoLoader from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';

import {SchemaService} from './schema.service';

const SCHEMA_PACKAGE_PATH = __dirname;

export const loadProtoService = (service: SchemaService) => {
  const protoPath = path.join(SCHEMA_PACKAGE_PATH, service.package, service.proto);
  const packageDefinition = protoLoader.loadSync(protoPath);
  const grpcObject = grpc.loadPackageDefinition(packageDefinition);
  const pkg = grpcObject[service.package];
  return (pkg as any)[service.service];
};
