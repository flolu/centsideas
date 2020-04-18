import { Event } from '@centsideas/event-sourcing';
import { NotificationSettingsEvents } from '@centsideas/enums';
import { INotificationSettingsState, INotificationSettingsUpdatedEvent } from '@centsideas/models';

export class NotificationSettingsUpdatedEvent extends Event<INotificationSettingsUpdatedEvent> {
  static readonly eventName: string = NotificationSettingsEvents.Updated;

  constructor(notificationSettingsId: string) {
    super(
      NotificationSettingsUpdatedEvent.eventName,
      { notificationSettingsId },
      notificationSettingsId,
    );
  }

  static commit(
    state: INotificationSettingsState,
    event: NotificationSettingsUpdatedEvent,
  ): INotificationSettingsState {
    return state;
  }
}
