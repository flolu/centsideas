// tslint:disable-next-line:no-var-requires
if (process.env['global.environment'] === 'dev') require('module-alias/register');

import 'reflect-metadata';

import {Logger} from '@centsideas/utils';
import {DI} from '@centsideas/dependency-injection';
import {SecretsConfig, GlobalConfig} from '@centsideas/config';
import {EventListener} from '@centsideas/event-sourcing';

import {MailingServer} from './mailing.server';
import {MailingConfig} from './mailing.config';

DI.registerProviders(MailingServer);
DI.registerSingletons(Logger, MailingConfig, SecretsConfig, GlobalConfig);

DI.registerProviders(EventListener);

DI.bootstrap(MailingServer);
