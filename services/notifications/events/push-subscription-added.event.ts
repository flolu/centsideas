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
    // TODO not sure if this workss
    // FIXME dont insert subscription if it is already in state.psuhSubscriptions
    // const existing = state.pushSubscriptions.indexOf(event.data.subscription);
    // if (existing) return state;
    for (const sub of state.pushSubscriptions) {
      if (sub.endpoint === event.data.subscription.endpoint) return state;
    }
    state.pushSubscriptions = [...state.pushSubscriptions, event.data.subscription];
    return state;
  }
}
