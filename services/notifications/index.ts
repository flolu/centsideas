// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.service = Services.Notifications;
import { DependencyInjection } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';
import { GlobalEnvironment } from '@centsideas/environment';
import { RpcServer, RPC_TYPES, rpcServerFactory } from '@centsideas/rpc';

import { NotificationsServer } from './notifications.server';
import { NotificationSettingsRepository } from './notification-settings.repository';
import { NotificationEnvironment } from './notifications.environment';
import { NotificationsHandlers } from './notifications.handlers';
import { NotificationSettingsHandlers } from './notification-settings.handlers';
import { EmailService } from './email.service';
import { NotificationsRepository } from './notifications.repository';

DependencyInjection.registerProviders(
  NotificationEnvironment,
  NotificationsServer,
  NotificationsHandlers,
  NotificationSettingsHandlers,
  MessageBroker,
  NotificationSettingsRepository,
  EmailService,
  NotificationsRepository,
  GlobalEnvironment,
  RpcServer,
);
DependencyInjection.registerFactory(RPC_TYPES.RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.bootstrap(NotificationsServer);
