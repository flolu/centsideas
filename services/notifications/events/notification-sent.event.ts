import { INotificationSentEvent, INotificationState } from '@centsideas/models';
import { Event } from '@centsideas/event-sourcing';
import { NotificationsEvents } from '@centsideas/enums';

export class NotificationSentEvent extends Event<INotificationSentEvent> {
  static readonly eventName: string = NotificationsEvents.Sent;

  constructor(notificationId: string) {
    super(NotificationSentEvent.eventName, {}, notificationId);
  }

  static commit(state: INotificationState, event: NotificationSentEvent): INotificationState {
    state.sentAt = event.timestamp;
    return state;
  }
}
