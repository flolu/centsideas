// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.service = Services.Users;
import { registerProviders, getProvider } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';
import { GlobalEnvironment } from '@centsideas/environment';

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
  GlobalEnvironment,
);

getProvider(UsersServer);
