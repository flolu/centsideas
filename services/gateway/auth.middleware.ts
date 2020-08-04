import * as express from 'express';
import {injectable} from 'inversify';
import {BaseMiddleware} from 'inversify-express-utils';

import {HeaderKeys, Environments} from '@centsideas/enums';
import {SecretsConfig, GlobalConfig} from '@centsideas/config';
import {AccessToken, UserId} from '@centsideas/types';

// TODO try to do auth token refresh in this middleware, such that client doesn't have to handle it

const getUserId = (accessToken: string, accessTokenSecret: string, isProd: boolean) => {
  try {
    const {userId} = AccessToken.fromString(accessToken, accessTokenSecret);
    return userId;
  } catch (error) {
    // FIXME I would prefer to remove this and instead authenticate, also in non prod environments
    if (!isProd) return UserId.fromString(accessToken);
    throw error;
  }
};

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  private accessTokenSecret = this.secretsConfig.get('secrets.tokens.access');
  private isProd = this.globalConfig.get('global.environment') === Environments.Prod;

  constructor(private secretsConfig: SecretsConfig, private globalConfig: GlobalConfig) {
    super();
  }

  handler(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const authHeader = req.headers[HeaderKeys.Auth];
      const accessToken = authHeader?.split(' ')[1] || '';
      const userId = getUserId(accessToken, this.accessTokenSecret, this.isProd);
      res.locals.userId = userId.toString();
      next();
    } catch (error) {
      next(error);
    }
  }
}

@injectable()
export class OptionalAuthMiddleware extends BaseMiddleware {
  private accessTokenSecret = this.secretsConfig.get('secrets.tokens.access');
  private isProd = this.globalConfig.get('global.environment') === Environments.Prod;

  constructor(private secretsConfig: SecretsConfig, private globalConfig: GlobalConfig) {
    super();
  }

  handler(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const authHeader = req.headers[HeaderKeys.Auth];
      const accessToken = authHeader?.split(' ')[1] || '';
      const userId = getUserId(accessToken, this.accessTokenSecret, this.isProd);
      res.locals.userId = userId.toString();
      next();
    } catch (error) {
      res.locals.userId = undefined;
      next();
    }
  }
}
