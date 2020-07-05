import * as express from 'express';
import {injectable} from 'inversify';
import {BaseMiddleware} from 'inversify-express-utils';

import {HeaderKeys, Environments} from '@centsideas/enums';
import {SecretsConfig, GlobalConfig} from '@centsideas/config';
import {AccessToken, UserId} from '@centsideas/types';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  private accessTokenSecret = this.secretsConfig.get('secrets.tokens.access');

  constructor(private secretsConfig: SecretsConfig, private globalConfig: GlobalConfig) {
    super();
  }

  handler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers[HeaderKeys.Auth];
    const accessToken = authHeader?.split(' ')[1] || '';
    try {
      const {userId} = AccessToken.fromString(accessToken, this.accessTokenSecret);
      res.locals.userId = userId;
      next();
    } catch (error) {
      // FIXME I would prefer to remove this and instead authenticate, also in non prod environments
      if (
        this.globalConfig.get('global.environment') === Environments.MicroK8s ||
        this.globalConfig.get('global.environment') === Environments.Dev
      ) {
        try {
          const userId = UserId.fromString(accessToken).toString();
          res.locals.userId = userId;
          return next();
        } catch (e) {
          next(error);
        }
      }
      next(error);
    }
  }
}
