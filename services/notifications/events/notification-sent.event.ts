import { Event } from '@centsideas/event-sourcing';
import { NotificationsEvents } from '@centsideas/enums';
import { INotificationSettingsState, INotificationSentEvent } from '@centsideas/models';

export class NotificationSentEvent extends Event<INotificationSentEvent> {
  static readonly eventName: string = NotificationsEvents.Sent;

  constructor(notificationId: string) {
    super(NotificationSentEvent.eventName, {}, notificationId);
  }

  static commit(
    state: INotificationSettingsState,
    event: NotificationSentEvent,
  ): INotificationSettingsState {
    return state;
  }
}
