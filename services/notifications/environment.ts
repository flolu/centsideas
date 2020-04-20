import { injectable } from 'inversify';

@injectable()
export class NotificationEnvironment {
  environment = process.env.ENV!;
  port = 3000;
  notificationSettingsDatabaseName = 'notification_settings';
  notificationsDatabaseName = 'notifications';
  databaseUrl = process.env.NOTIFICATIONS_DATABASE_URL!;
  frontendUrl = process.env.FRONTEND_URL!;
  vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;
  vapidPublicKey = process.env.VAPID_PUBLIC_KEY!;
}
