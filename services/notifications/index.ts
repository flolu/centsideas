// tslint:disable-next-line:no-var-requires
if (!process.env.environment) require('../../register-aliases').registerAliases();

import { DependencyInjection } from '@centsideas/dependency-injection';
import { UTILS_TYPES, Logger } from '@centsideas/utils';
import { Services } from '@centsideas/enums';
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
DependencyInjection.registerConstant(UTILS_TYPES.SERVICE_NAME, Services.Notifications);
DependencyInjection.registerConstant(UTILS_TYPES.LOGGER_COLOR, [206, 100, 80]);
DependencyInjection.registerSingleton(Logger);
DependencyInjection.registerFactory(RPC_TYPES.RPC_SERVER_FACTORY, rpcServerFactory);
DependencyInjection.bootstrap(NotificationsServer);
