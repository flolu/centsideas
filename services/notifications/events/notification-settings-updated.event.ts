import { Event } from '@centsideas/event-sourcing';
import { NotificationSettingsEvents } from '@centsideas/enums';
import { INotificationSettingsState, INotificationSettingsUpdatedEvent } from '@centsideas/models';

export class NotificationSettingsUpdatedEvent extends Event<INotificationSettingsUpdatedEvent> {
  static readonly eventName: string = NotificationSettingsEvents.Updated;

  constructor(notificationSettingsId: string, sendEmails: boolean, sendPushes: boolean) {
    super(
      NotificationSettingsUpdatedEvent.eventName,
      { sendEmails, sendPushes },
      notificationSettingsId,
    );
  }

  static commit(
    state: INotificationSettingsState,
    event: NotificationSettingsUpdatedEvent,
  ): INotificationSettingsState {
    state.sendEmails = event.data.sendEmails;
    state.sendPushes = event.data.sendPushes;
    return state;
  }
}
