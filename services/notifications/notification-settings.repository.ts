import { injectable } from 'inversify';
import { EventRepository, EntityMapping } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { NotificationEnvironment } from './notifications.environment';
import { NotificationSettings } from './notification-settings.entity';
import { IUserIdNotificationSettingsMapping } from './models';

@injectable()
export class NotificationSettingsRepository extends EventRepository<NotificationSettings> {
  constructor(private env: NotificationEnvironment) {
    super(
      NotificationSettings,
      env.databaseUrl,
      env.notificationSettingsDatabaseName,
      EventTopics.Notifications,
    );
  }

  userIdMapping = new EntityMapping<IUserIdNotificationSettingsMapping>(
    this.env.databaseUrl,
    'userIdMappings',
    'notificationSettingsId',
    'userId',
  );
}
