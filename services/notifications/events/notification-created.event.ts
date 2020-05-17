import {INotificationCreatedEvent, INotificationState, IInResponseTo} from '@centsideas/models';
import {Event} from '@centsideas/event-sourcing';
import {NotificationsEvents, NotificationMedium} from '@centsideas/enums';

export class NotificationCreatedEvent extends Event<INotificationCreatedEvent> {
  static readonly eventName: string = NotificationsEvents.Created;

  constructor(
    notificationId: string,
    receiverUserId: string | null,
    inResponseTo: IInResponseTo,
    medium: NotificationMedium,
  ) {
    super(
      NotificationCreatedEvent.eventName,
      {notificationId, receiverUserId, inResponseTo, medium},
      notificationId,
    );
  }

  static commit(state: INotificationState, event: NotificationCreatedEvent): INotificationState {
    state.id = event.aggregateId;
    state.receiverUserId = event.data.receiverUserId;
    state.inResponseTo = event.data.inResponseTo;
    state.medium = event.data.medium;
    return state;
  }
}
