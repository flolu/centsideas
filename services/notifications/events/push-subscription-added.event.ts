import { Event } from '@centsideas/event-sourcing';
import { NotificationSettingsEvents } from '@centsideas/enums';
import {
  INotificationSettingsState,
  IPushSubscriptionAddedEvent,
  IPushSubscription,
} from '@centsideas/models';

export class PushSubscriptionAddedEvent extends Event<IPushSubscriptionAddedEvent> {
  static readonly eventName: string = NotificationSettingsEvents.AddedPush;

  constructor(notificationSettingsId: string, subscription: IPushSubscription) {
    super(PushSubscriptionAddedEvent.eventName, { subscription }, notificationSettingsId);
  }

  static commit(
    state: INotificationSettingsState,
    event: PushSubscriptionAddedEvent,
  ): INotificationSettingsState {
    state.pushSubscriptions = [...state.pushSubscriptions, event.data.subscription];
    return state;
  }
}
