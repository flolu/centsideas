import { injectable } from 'inversify';
import { EventRepository, MessageBroker, EntityMapping } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { NotificationEnvironment } from './notifications.environment';
import { NotificationSettings } from './notification-settings.entity';
import { IUserIdNotificationSettingsMapping } from './models';

@injectable()
export class NotificationSettingsRepository extends EventRepository<NotificationSettings> {
  userIdMapping = new EntityMapping<IUserIdNotificationSettingsMapping>(
    this.env.databaseUrl,
    'userIdMappings',
    'notificationSettingsId',
    'userId',
  );

  constructor(private messageBroker: MessageBroker, private env: NotificationEnvironment) {
    super(
      messageBroker.dispatchEvents,
      NotificationSettings,
      env.databaseUrl,
      env.notificationSettingsDatabaseName,
      EventTopics.Notifications,
    );
  }
}
