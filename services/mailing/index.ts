// tslint:disable-next-line:no-var-requires
if (process.env['global.environment'] === 'dev') require('module-alias/register');

import 'reflect-metadata';

import {Logger} from '@centsideas/utils';
import {DI} from '@centsideas/dependency-injection';
import {SecretsConfig, GlobalConfig} from '@centsideas/config';
import {EventListener} from '@centsideas/event-sourcing';
import {RPC_CLIENT_FACTORY, rpcClientFactory, RpcClient} from '@centsideas/rpc';

import {MailingServer} from './mailing.server';
import {MailingConfig} from './mailing.config';
import {UserReadAdapter} from './user-read.adapter';
import {MailingService} from './mailing.service';

DI.registerProviders(MailingServer, UserReadAdapter, MailingService);
DI.registerSingletons(Logger, MailingConfig, SecretsConfig, GlobalConfig);

DI.registerProviders(EventListener, RpcClient);
DI.registerFactory(RPC_CLIENT_FACTORY, rpcClientFactory);

DI.bootstrap(MailingServer);
