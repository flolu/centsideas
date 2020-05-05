import * as http from 'http';
import { injectable } from 'inversify';

import { Logger } from '@centsideas/utils';
import { EventTopics, IdeaEvents, LoginEvents, UserEvents } from '@centsideas/enums';
import { IEvent } from '@centsideas/models';
import { MessageBroker } from '@centsideas/event-sourcing';
import {
  RpcServer,
  INotificationCommands,
  SubscribePushNotifications,
  UpdateNotificationSettings,
  GetNotificationSettings,
} from '@centsideas/rpc';
import { GlobalEnvironment } from '@centsideas/environment';

import { NotificationSettingsHandlers } from './notification-settings.handlers';
import { NotificationsHandlers } from './notifications.handlers';

@injectable()
export class NotificationsServer {
  constructor(
    private globalEnv: GlobalEnvironment,
    private notificationSettingsHandlers: NotificationSettingsHandlers,
    private messageBroker: MessageBroker,
    private notificationsHandler: NotificationsHandlers,
    private rpcServer: RpcServer,
  ) {
    // FIXME also consider kafka connection in health checks
    http
      .createServer((_, res) => res.writeHead(this.rpcServer.isRunning ? 200 : 500).end())
      .listen(3000);

    this.messageBroker.events(EventTopics.Ideas).subscribe(this.handleIdeasEvents);
    this.messageBroker.events(EventTopics.Logins).subscribe(this.handleLoginEvents);
    this.messageBroker.events(EventTopics.Users).subscribe(this.handleUsersEvents);

    const commandService = this.rpcServer.loadService('notification', 'NotificationCommands');
    this.rpcServer.addService<INotificationCommands>(commandService, {
      subscribePush: this.subscribePush,
      updateSettings: this.updateSettings,
      getSettings: this.getSettings,
    });

    Logger.info('launch in', this.globalEnv.environment, 'mode');
  }

  subscribePush: SubscribePushNotifications = async ({ subscription, userId }) => {
    const upserted = await this.notificationSettingsHandlers.upsert(userId);
    const updated = await this.notificationSettingsHandlers.addPushSubscription(
      upserted.persistedState.id,
      userId,
      subscription,
    );
    // FIXME acutally, we don't really need to return push sub array?!
    return updated.persistedState;
  };

  updateSettings: UpdateNotificationSettings = async ({ sendEmails, sendPushes, userId }) => {
    const upserted = await this.notificationSettingsHandlers.upsert(userId);
    const updated = await this.notificationSettingsHandlers.updateSettings(
      upserted.persistedState.id,
      userId,
      { sendPushes, sendEmails },
    );
    return updated.persistedState;
  };

  getSettings: GetNotificationSettings = async ({ userId }) => {
    const settings = await this.notificationSettingsHandlers.upsert(userId);
    return settings.persistedState;
  };

  private handleIdeasEvents = async (event: IEvent<any>) => {
    try {
      switch (event.name) {
        case IdeaEvents.IdeaCreated:
          return this.notificationsHandler.handleIdeaCreatedNotification(event);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  private handleLoginEvents = async (event: IEvent<any>) => {
    try {
      switch (event.name) {
        case LoginEvents.LoginRequested:
          return this.notificationsHandler.handleLoginNotification(event);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  private handleUsersEvents = async (event: IEvent<any>) => {
    try {
      switch (event.name) {
        case UserEvents.EmailChangeRequested:
          return this.notificationsHandler.handleEmailChangeRequestedNotification(event);

        case UserEvents.EmailChangeConfirmed:
          return this.notificationsHandler.handleEmailChangedNotification(event);
      }
    } catch (error) {
      Logger.error(error);
    }
  };
}
