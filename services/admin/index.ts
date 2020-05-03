// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.service = Services.Admin;
import { registerProviders, getProvider, registerConstant } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';
import { GlobalEnvironment } from '@centsideas/environment';

import { AdminServer } from './admin.server';
import { AdminEnvironment } from './admin.environment';
import { AdminDatabase } from './admin.database';
import { RpcServer } from '@centsideas/rpc';

registerProviders(AdminServer, AdminEnvironment, MessageBroker, AdminDatabase, GlobalEnvironment);

const env: AdminEnvironment = getProvider(AdminEnvironment);
registerConstant(RpcServer, new RpcServer(env.rpc.host, env.rpc.port));

getProvider(AdminServer);

// TODO store unexpected errors in admin service db (connect to logger)
