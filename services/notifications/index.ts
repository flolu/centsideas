import 'reflect-metadata';
// tslint:disable-next-line:no-var-requires
if (process.env.ENV === 'dev') require('../../register-aliases').registerAliases();

import { LoggerPrefixes } from '@centsideas/enums';
import { registerProviders, getProvider } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';

import { NotificationsServer } from './notifications.server';
import { NotificationSettingsRepository } from './notification-settings.repository';
import { NotificationEnvironment } from './notifications.environment';
import { NotificationsHandlers } from './notifications.handlers';
import { NotificationSettingsHandlers } from './notification-settings.handlers';
import { EmailService } from './email.service';

process.env.LOGGER_PREFIX = LoggerPrefixes.Notifications;

registerProviders(
  NotificationEnvironment,
  NotificationsServer,
  NotificationsHandlers,
  NotificationSettingsHandlers,
  MessageBroker,
  NotificationSettingsRepository,
  EmailService,
);

getProvider(NotificationsServer);
