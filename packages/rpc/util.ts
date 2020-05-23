import * as path from 'path';
import * as protoLoader from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';

const protoRootPath = path.resolve(__dirname);

export const loadProtoPackage = (name: string) => {
  const protoFilePath = path.join(protoRootPath, `${name}.proto`);
  const packageDef = protoLoader.loadSync(protoFilePath);
  const grpcObject = grpc.loadPackageDefinition(packageDef);
  return grpcObject[name];
};
