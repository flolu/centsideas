import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { Notification } from './notification.entity';
import { NotificationEnvironment } from './notifications.environment';

@injectable()
export class NotificationsRepository extends EventRepository<Notification> {
  constructor(private _messageBroker: MessageBroker, private env: NotificationEnvironment) {
    super(_messageBroker);
    this.initialize(
      Notification,
      this.env.databaseUrl,
      this.env.notificationsDatabaseName,
      EventTopics.Notifications,
    );
  }
}
