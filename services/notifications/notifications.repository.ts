import { injectable, inject } from 'inversify';

import { EventRepository } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { Notification } from './notification.entity';
import { NotificationEnvironment } from './notifications.environment';

@injectable()
export class NotificationsRepository extends EventRepository<Notification> {
  constructor(@inject(NotificationEnvironment) env: NotificationEnvironment) {
    super(Notification, env.databaseUrl, env.notificationsDatabaseName, EventTopics.Notifications);
  }
}
