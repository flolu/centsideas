import * as express from 'express';
import {injectable} from 'inversify';
import {BaseMiddleware} from 'inversify-express-utils';

import {IAccessTokenPayload} from '@centsideas/models';
import {decodeToken} from '@centsideas/utils';
import {HeaderKeys, Environments} from '@centsideas/enums';
import {GlobalConfig, SecretsConfig} from '@centsideas/config';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  constructor(private globalConfig: GlobalConfig, private secretsConfig: SecretsConfig) {
    super();
  }

  // TODO use new token type
  public handler(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers[HeaderKeys.Auth];
    const accessToken = authHeader?.split(' ')[1];
    if (!accessToken) return next();

    let userId = '';
    if (this.globalConfig.get('global.environment') === Environments.Dev) userId = accessToken;
    // FIXME remove eventually (this is just for tesging without frontend)
    if (this.globalConfig.get('global.environment') === Environments.MicroK8s) userId = accessToken;

    try {
      const data = decodeToken<IAccessTokenPayload>(
        accessToken,
        this.secretsConfig.get('secrets.tokens.access'),
      );
      userId = data.userId;
      // tslint:disable-next-line:no-empty
    } catch (error) {}

    res.locals.userId = userId;
    next();
  }
}
