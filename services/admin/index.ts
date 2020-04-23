import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
if (process.env.ENV === 'dev') require('../../register-aliases').registerAliases();

import { registerProviders, getProvider } from '@centsideas/utils';
import { LoggerPrefixes } from '@centsideas/enums';

import { AdminServer } from './admin.server';
import { AdminEnvironment } from './admin.environment';

process.env.LOGGER_PREFIX = LoggerPrefixes.Admin;

registerProviders(AdminServer, AdminEnvironment);

getProvider(AdminServer);
