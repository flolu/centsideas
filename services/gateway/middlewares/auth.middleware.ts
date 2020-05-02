import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';

import { IAccessTokenPayload } from '@centsideas/models';
import { HeaderKeys } from '@centsideas/enums';

import { GatewayEnvironment } from '../gateway.environment';

// TODO try https://github.com/inversify/inversify-express-utils#authprovider

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  constructor(private env: GatewayEnvironment) {
    super();
  }

  public handler(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.locals.userId = null;
    const authHeader = req.headers[HeaderKeys.Auth];
    if (!authHeader) return next();

    try {
      const accessToken = (authHeader as string).split(' ')[1];
      const decoded = jwt.verify(accessToken, this.env.accessTokenSecret);
      const data: IAccessTokenPayload = decoded as any;
      // TODO maybe set userid on http context instead of res.locals
      res.locals.userId = data.userId;
      // tslint:disable-next-line:no-empty
    } catch (error) {}

    next();
  }
}
