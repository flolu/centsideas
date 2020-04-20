import { EventEntity, ISnapshot, initialEntityBaseState } from '@centsideas/event-sourcing';
import { INotificationSettingsState, IPushSubscription } from '@centsideas/models';

import { notificationSettingsCommitFunctions, NotificationSettingsEvents } from './events';

export class NotificationSettings extends EventEntity<INotificationSettingsState> {
  static initialState: INotificationSettingsState = {
    ...initialEntityBaseState,
    userId: '',
    pushSubscriptions: [],
    sendPushes: false,
    sendEmails: false,
  };

  constructor(snapshot?: ISnapshot<INotificationSettingsState>) {
    if (snapshot && snapshot.state) {
      super(notificationSettingsCommitFunctions, snapshot.state);
      this.persistedState.lastEventId = snapshot.lastEventId;
    } else super(notificationSettingsCommitFunctions, NotificationSettings.initialState);
  }

  static create(notificationSettingsId: string, userId: string): NotificationSettings {
    const notificationSettings = new NotificationSettings();
    notificationSettings.pushEvents(
      new NotificationSettingsEvents.NotificationSettingsCreatedEvent(
        notificationSettingsId,
        userId,
      ),
    );
    return notificationSettings;
  }

  addPushSubscription(subscription: IPushSubscription): NotificationSettings {
    this.pushEvents(
      new NotificationSettingsEvents.PushSubscriptionAddedEvent(this.currentState.id, subscription),
    );
    return this;
  }

  update(sendEmails: boolean, sendPushes: boolean): NotificationSettings {
    this.pushEvents(
      new NotificationSettingsEvents.NotificationSettingsUpdatedEvent(
        this.currentState.id,
        sendEmails,
        sendPushes,
      ),
    );
    return this;
  }
}
