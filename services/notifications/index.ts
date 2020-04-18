import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
if (process.env.ENV === 'dev') require('../../register-aliases').registerAliases();

import { LoggerPrefixes } from '@centsideas/enums';
import { registerProviders, getProvider } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';

import { NotificationsServer } from './notifications.server';
import { NotificationSettingsRepository } from './notification-settings.repository';
import { NotificationEnvironment } from './environment';
import { NotificationsHandlers } from './notifications.handlers';

process.env.LOGGER_PREFIX = LoggerPrefixes.Notifications;

registerProviders(
  NotificationEnvironment,
  NotificationsServer,
  NotificationsHandlers,
  MessageBroker,
  NotificationSettingsRepository,
);

getProvider(NotificationsServer);
