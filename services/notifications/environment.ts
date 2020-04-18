import { injectable } from 'inversify';

@injectable()
export class NotificationEnvironment {
  environment = process.env.ENV!;
  port = 3000;
  notificationSettingsDatabaseName = 'notification-settings';
  notificationsDatabaseName = 'notifications';
  databaseUrl = process.env.NOTIFICATIONS_DATABASE_URL!;
}
