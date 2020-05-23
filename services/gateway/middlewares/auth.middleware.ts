import * as express from 'express';
import {injectable} from 'inversify';
import {BaseMiddleware} from 'inversify-express-utils';

import {IAccessTokenPayload} from '@centsideas/models';
import {GlobalEnvironment} from '@centsideas/environment';
import {decodeToken} from '@centsideas/utils';
import {HeaderKeys, Environments} from '@centsideas/enums';

import {GatewayEnvironment} from '../gateway.environment';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  constructor(private env: GatewayEnvironment, private globalEnv: GlobalEnvironment) {
    super();
  }

  public handler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers[HeaderKeys.Auth];
    const accessToken = authHeader?.split(' ')[1];
    if (!accessToken) return next();

    let userId = '';
    if (this.globalEnv.environment === Environments.Dev) userId = accessToken;

    try {
      const data = decodeToken<IAccessTokenPayload>(accessToken, this.env.accessTokenSecret);
      userId = data.userId;
      // tslint:disable-next-line:no-empty
    } catch (error) {}

    res.locals.userId = userId;
    next();
  }
}
