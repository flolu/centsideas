import { Event } from '@centsideas/event-sourcing';
import { NotificationSettingsEvents } from '@centsideas/enums';
import { INotificationSettingsState, INotificationSettingsCreatedEvent } from '@centsideas/models';

export class NotificationSettingsCreatedEvent extends Event<INotificationSettingsCreatedEvent> {
  static readonly eventName: string = NotificationSettingsEvents.Created;

  constructor(notificationSettingsId: string, userId: string) {
    super(
      NotificationSettingsCreatedEvent.eventName,
      { notificationSettingsId, userId },
      notificationSettingsId,
    );
  }

  static commit(
    state: INotificationSettingsState,
    event: NotificationSettingsCreatedEvent,
  ): INotificationSettingsState {
    state.id = event.aggregateId;
    state.userId = event.data.userId;
    return state;
  }
}
