// tslint:disable-next-line:no-var-requires
if (process.env.ENV === 'dev') require('../../register-aliases').registerAliases();
import 'reflect-metadata';

import { Services } from '@centsideas/enums';
process.env.SERVICE = Services.Notifications;
import { registerProviders, getProvider } from '@centsideas/utils';
import { MessageBroker } from '@centsideas/event-sourcing';

import { NotificationsServer } from './notifications.server';
import { NotificationSettingsRepository } from './notification-settings.repository';
import { NotificationEnvironment } from './notifications.environment';
import { NotificationsHandlers } from './notifications.handlers';
import { NotificationSettingsHandlers } from './notification-settings.handlers';
import { EmailService } from './email.service';
import { NotificationsRepository } from './notifications.repository';

registerProviders(
  NotificationEnvironment,
  NotificationsServer,
  NotificationsHandlers,
  NotificationSettingsHandlers,
  MessageBroker,
  NotificationSettingsRepository,
  EmailService,
  NotificationsRepository,
);

getProvider(NotificationsServer);
