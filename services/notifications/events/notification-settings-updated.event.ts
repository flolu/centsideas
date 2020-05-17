import {Event} from '@centsideas/event-sourcing';
import {NotificationSettingsEvents} from '@centsideas/enums';
import {INotificationSettingsState, INotificationSettingsUpdatedEvent} from '@centsideas/models';

export class NotificationSettingsUpdatedEvent extends Event<INotificationSettingsUpdatedEvent> {
  static readonly eventName: string = NotificationSettingsEvents.Updated;

  constructor(notificationSettingsId: string, payload: INotificationSettingsUpdatedEvent) {
    super(NotificationSettingsUpdatedEvent.eventName, payload, notificationSettingsId);
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
