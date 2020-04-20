import { injectable } from 'inversify';
import { EventRepository, MessageBroker, EntityMapping } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { NotificationEnvironment } from './notifications.environment';
import { NotificationSettings } from './notification-settings.entity';
import { IUserIdNotificationSettingsMapping } from './models';

@injectable()
export class NotificationSettingsRepository extends EventRepository<NotificationSettings> {
  // TODO also use the entity mapping abstraction in other repos
  userIdMapping = new EntityMapping<IUserIdNotificationSettingsMapping>(
    this.env.databaseUrl,
    'userIdMappings',
    'notificationSettingsId',
    'userId',
  );

  constructor(private _messageBroker: MessageBroker, private env: NotificationEnvironment) {
    super(_messageBroker);
    this.initialize(
      NotificationSettings,
      this.env.databaseUrl,
      this.env.notificationSettingsDatabaseName,
      EventTopics.Notifications,
    );
  }
}
