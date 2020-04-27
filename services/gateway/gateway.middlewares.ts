import * as cors from 'cors';
import { injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { HeaderKeys } from '@centsideas/enums';
import { IAccessTokenPayload } from '@centsideas/models';

import { GatewayEnvironment } from './gateway.environment';

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
      res.locals.userId = data.userId;
      // tslint:disable-next-line:no-empty
    } catch (error) {}

    next();
  };

  private checkOrigin = (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin || this.corsWhitelist.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  };

  cors: any = cors({ origin: this.checkOrigin, credentials: true });

  private get corsWhitelist() {
    let whitelist = [this.env.mainClientUrl, this.env.adminClientUrl];
    if (this.env.environment === 'dev')
      whitelist = [
        ...whitelist,
        'http://localhost:4000',
        'http://localhost:4200',
        'http://localhost:4201',
        'http://localhost:8080',
      ];
    return whitelist;
  }
}
