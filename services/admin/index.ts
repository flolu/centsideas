// tslint:disable-next-line:no-var-requires
if (process.env.ENV === 'dev') require('../../register-aliases').registerAliases();
import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.SERVICE = Services.Admin;
import { registerProviders, getProvider } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';

import { AdminServer } from './admin.server';
import { AdminEnvironment } from './admin.environment';
import { AdminDatabase } from './admin.database';

registerProviders(AdminServer, AdminEnvironment, MessageBroker, AdminDatabase);

getProvider(AdminServer);

// TODO store unexpected errors in admin service db (connect to logger)
