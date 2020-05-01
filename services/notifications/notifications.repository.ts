import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { Notification } from './notification.entity';
import { NotificationEnvironment } from './notifications.environment';

@injectable()
export class NotificationsRepository extends EventRepository<Notification> {
  constructor(private messageBroker: MessageBroker, private env: NotificationEnvironment) {
    super(
      messageBroker.dispatchEvents,
      Notification,
      env.databaseUrl,
      env.notificationsDatabaseName,
      EventTopics.Notifications,
    );
  }
}
