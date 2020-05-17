import {injectable} from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class UsersEnvironment {
  userDatabaseName = 'users';
  loginDatabaseName = 'logins';

  databaseUrl = environment.usersDatabaseUrl;
  accessTokenSecret = environment.accessTokenSecret;
  refreshTokenSecret = environment.refreshTokenSecret;
  loginTokenSecret = environment.loginTokenSecret;
  changeEmailTokenSecret = environment.changeEmailTokenSecret;
  googleClientId = environment.googleClientId;
  googleClientSecret = environment.googleClientSecret;
  rpcPort = environment.usersRpcPort;
}
