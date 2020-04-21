import { Event } from '@centsideas/event-sourcing';
import { NotificationSettingsEvents } from '@centsideas/enums';
import {
  INotificationSettingsState,
  IPushSubscriptionsRemovedEvent,
  IPushSubscription,
} from '@centsideas/models';

export class PushSubscriptionsRemovedEvent extends Event<IPushSubscriptionsRemovedEvent> {
  static readonly eventName: string = NotificationSettingsEvents.RemovedSubs;

  constructor(notificationSettingsId: string, subscriptions: IPushSubscription[]) {
    super(PushSubscriptionsRemovedEvent.eventName, { subscriptions }, notificationSettingsId);
  }

  static commit(
    state: INotificationSettingsState,
    event: PushSubscriptionsRemovedEvent,
  ): INotificationSettingsState {
    const updated: IPushSubscription[] = [];
    const endpointsToRemove = event.data.subscriptions.map(s => s.endpoint);
    for (const sub of state.pushSubscriptions) {
      if (!endpointsToRemove.includes(sub.endpoint)) updated.push(sub);
    }

    state.pushSubscriptions = updated;
    return state;
  }
}
