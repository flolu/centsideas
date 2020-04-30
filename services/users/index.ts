// tslint:disable-next-line:no-var-requires
if (process.env.environment === 'dev') require('../../register-aliases').registerAliases();
import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.SERVICE = Services.Users;
import { registerProviders, getProvider } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';

import { UsersServer } from './users.server';
import { UsersHandler } from './users.handler';
import { UserRepository } from './user.repository';
import { LoginRepository } from './login.repository';
import { AuthService } from './auth.service';
import { AuthHandler } from './auth.handler';
import { UsersEnvironment } from './users.environment';
import { UsersService } from './users.service';

registerProviders(
  UsersServer,
  UsersHandler,
  UserRepository,
  AuthService,
  AuthHandler,
  LoginRepository,
  MessageBroker,
  UsersEnvironment,
  UsersService,
);

getProvider(UsersServer);
