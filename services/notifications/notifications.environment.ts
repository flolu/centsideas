import { injectable } from 'inversify';

import environment from '@centsideas/environment';

@injectable()
export class NotificationEnvironment {
  environment = environment.environment;
  port = 3000;
  notificationSettingsDatabaseName = 'notification_settings';
  notificationsDatabaseName = 'notifications';
  databaseUrl = environment.notificationsDatabaseUrl;
  frontendUrl = environment.mainClientUrl;
  vapidPrivateKey = environment.vapidPrivateKey;
  vapidPublicKey = environment.vapidPublicKey;
  kafka = {
    brokers: [environment.kafkaBrokerHost],
  };
  mailing = {
    apiKey: environment.sendgridApiKey,
    fromAddress: 'CENTS Ideas <noreply@centsideas.com>',
  };
  rpc = {
    host: '0.0.0.0',
    port: environment.notificationsRpcPort,
  };
}
