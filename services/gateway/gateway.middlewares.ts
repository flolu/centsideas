import * as cors from 'cors';
import { injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { HeaderKeys, Environments } from '@centsideas/enums';
import { IAccessTokenPayload } from '@centsideas/models';

import { GatewayEnvironment } from './gateway.environment';

// TODO use inversify to inject into the express server

@injectable()
export class GatewayMiddlewares {
  constructor(private env: GatewayEnvironment) {}

  auth: any = (req: Request, res: Response, next: NextFunction): void => {
    res.locals.userId = null;
    const authHeader = req.headers[HeaderKeys.Auth];
    if (!authHeader) return next();

    try {
      const accessToken = (authHeader as string).split(' ')[1];
      const decoded = jwt.verify(accessToken, this.env.accessTokenSecret);
      const data: IAccessTokenPayload = decoded as any;
      // TODO find better place to store userId (probably with inversify-express-utils)
      res.locals.userId = data.userId;
      // tslint:disable-next-line:no-empty
    } catch (error) {}

    next();
  };

  private checkOrigin = (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (this.env.environment === Environments.Dev) return callback(null, true);

    // TODO is this save? why can origin be undefined?
    if (!origin) return callback(null, true);

    const whitelist = [this.env.mainClientUrl, this.env.adminClientUrl];
    if (whitelist.includes(origin)) return callback(null, true);

    callback(new Error('Not allowed by CORS'), false);
  };

  cors: any = cors({ origin: this.checkOrigin, credentials: true });
}
