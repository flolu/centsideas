import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as grpc from '@grpc/grpc-js';
import { injectable } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import { Logger, DependencyInjection } from '@centsideas/utils';
import { Environments } from '@centsideas/enums';
import { GlobalEnvironment } from '@centsideas/environment';

import { GatewayEnvironment } from './gateway.environment';

@injectable()
export class GatewayServer {
  grpcHttpMap = new Map<number, number>();

  constructor(private globalEnv: GlobalEnvironment, private env: GatewayEnvironment) {
    this.initializeGrpcHttpMap();

    Logger.info('launch in', this.globalEnv.environment, 'mode');
    const server = new InversifyExpressServer(DependencyInjection.getContainer());
    server.setConfig((app: express.Application) => {
      app.use(helmet());
      app.use(
        cors({
          origin: (origin, callback) =>
            this.isOriginAllowed(origin)
              ? callback(null, true)
              : callback(Error('not allowed by cors'), false),
          credentials: true,
        }),
      );
      app.use(bodyParser.json());
      app.use(cookieParser());
    });

    server.setErrorConfig(app => {
      app.use(
        (err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
          if (!err) return res.status(500);
          if (!err.code) return res.status(500);

          const message = err.details;
          const httpCode = this.grpcHttpMap.get(err.code) || 500;
          const name = err.metadata?.get('name')[0] || '';
          const unexpected = httpCode >= 500 ? true : false;

          res.status(httpCode).json({ message, unexpected, name });
        },
      );
    });
    server.build().listen(this.env.port);
  }

  private isOriginAllowed = (origin: string | undefined) => {
    if (this.globalEnv.environment === Environments.Dev) return true;
    if (origin && this.env.corsWhitelist.includes(origin)) return true;

    if (origin === undefined) Logger.info('Origin is undefined');

    return false;
  };

  private initializeGrpcHttpMap() {
    this.grpcHttpMap.set(grpc.status.OK, 200);
    this.grpcHttpMap.set(grpc.status.INVALID_ARGUMENT, 400);
    this.grpcHttpMap.set(grpc.status.FAILED_PRECONDITION, 400);
    this.grpcHttpMap.set(grpc.status.OUT_OF_RANGE, 400);
    this.grpcHttpMap.set(grpc.status.UNAUTHENTICATED, 401);
    this.grpcHttpMap.set(grpc.status.PERMISSION_DENIED, 403);
    this.grpcHttpMap.set(grpc.status.NOT_FOUND, 404);
    this.grpcHttpMap.set(grpc.status.ABORTED, 409);
    this.grpcHttpMap.set(grpc.status.ALREADY_EXISTS, 409);
    this.grpcHttpMap.set(grpc.status.RESOURCE_EXHAUSTED, 429);
    this.grpcHttpMap.set(grpc.status.CANCELLED, 499);
    this.grpcHttpMap.set(grpc.status.DATA_LOSS, 500);
    this.grpcHttpMap.set(grpc.status.UNKNOWN, 500);
    this.grpcHttpMap.set(grpc.status.INTERNAL, 500);
    this.grpcHttpMap.set(grpc.status.UNAVAILABLE, 503);
    this.grpcHttpMap.set(grpc.status.DEADLINE_EXCEEDED, 504);
  }
}
