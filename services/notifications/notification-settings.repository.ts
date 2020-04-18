import { injectable } from 'inversify';
import { EventRepository, MessageBroker } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { NotificationEnvironment } from './environment';
import { NotificationSettings } from './notification-settings.entity';

@injectable()
export class NotificationSettingsRepository extends EventRepository<NotificationSettings> {
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
