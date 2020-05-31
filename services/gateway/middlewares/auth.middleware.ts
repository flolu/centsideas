import * as express from 'express';
import {injectable} from 'inversify';
import {BaseMiddleware} from 'inversify-express-utils';

import {IAccessTokenPayload} from '@centsideas/models';
import {decodeToken} from '@centsideas/utils';
import {HeaderKeys, Environments} from '@centsideas/enums';
import {GlobalConfig} from '@centsideas/config';

import {GatewayConfig} from '../gateway.config';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  constructor(private config: GatewayConfig, private globalConfig: GlobalConfig) {
    super();
  }

  public handler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers[HeaderKeys.Auth];
    const accessToken = authHeader?.split(' ')[1];
    if (!accessToken) return next();

    let userId = '';
    if (this.globalConfig.get('global.environment') === Environments.Dev) userId = accessToken;

    try {
      const data = decodeToken<IAccessTokenPayload>(
        accessToken,
        // FIXME eventually add access token secret
        'temp' || this.config.get('accessTokenSecret'),
      );
      userId = data.userId;
      // tslint:disable-next-line:no-empty
    } catch (error) {}

    res.locals.userId = userId;
    next();
  }
}
