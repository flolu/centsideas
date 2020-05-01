import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { Notification } from './notification.entity';
import { NotificationEnvironment } from './notifications.environment';

@injectable()
export class NotificationsRepository extends EventRepository<Notification> {
  constructor(private _messageBroker: MessageBroker, private _env: NotificationEnvironment) {
    super(
      _messageBroker.dispatchEvents,
      Notification,
      _env.databaseUrl,
      _env.notificationsDatabaseName,
      EventTopics.Notifications,
    );
  }
}
