import { injectable } from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class UsersEnvironment {
  environment = environment.environment;
  port = 3000;
  databaseUrl = environment.usersDatabaseUrl;
  userDatabaseName = 'users';
  loginDatabaseName = 'logins';
  frontendUrl = environment.mainClientUrl;
  tokenSecrets = {
    accessToken: environment.accessTokenSecret,
    refreshToken: environment.refreshTokenSecret,
    loginToken: environment.loginTokenSecret,
    changeEmailToken: environment.changeEmailTokenSecret,
  };
  google = {
    clientId: environment.googleClientId,
    clientSecret: environment.googleClientSecret,
  };
  exchangeSecrets = {
    frontendServer: environment.frontendServerExchangeSecret,
  };
}
