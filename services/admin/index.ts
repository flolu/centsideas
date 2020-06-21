import 'reflect-metadata';

// tslint:disable-next-line:no-var-requires
if (process.env['global.environment'] === 'dev') require('module-alias/register');

import {DI} from '@centsideas/dependency-injection';
import {Logger} from '@centsideas/utils';
import {GlobalConfig} from '@centsideas/config';

import {AdminServer} from './admin.server';

DI.registerProviders(AdminServer);
DI.registerProviders(Logger, GlobalConfig);

DI.bootstrap(AdminServer);
