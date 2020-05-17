import {EventEntity, ISnapshot, initialEntityBaseState} from '@centsideas/event-sourcing';
import {INotificationState, IInResponseTo} from '@centsideas/models';
import {NotificationMedium} from '@centsideas/enums';

import {notificationsCommitFunctions, NotificationsEvents} from './events';

export class Notification extends EventEntity<INotificationState> {
  static initialState: INotificationState = {
    ...initialEntityBaseState,
    receiverUserId: '',
    inResponseTo: null,
    medium: null,
    sentAt: null,
  };

  constructor(snapshot?: ISnapshot<INotificationState>) {
    if (snapshot && snapshot.state) {
      super(notificationsCommitFunctions, snapshot.state);
      this.persistedState.lastEventId = snapshot.lastEventId;
    } else super(notificationsCommitFunctions, Notification.initialState);
  }

  static create(
    notificationId: string,
    receiverUserId: string | null,
    inResponseTo: IInResponseTo,
    medium: NotificationMedium,
  ) {
    const notification = new Notification();
    notification.pushEvents(
      new NotificationsEvents.NotificationCreatedEvent(
        notificationId,
        receiverUserId,
        inResponseTo,
        medium,
      ),
    );
    return notification;
  }

  sent() {
    this.pushEvents(new NotificationsEvents.NotificationSentEvent(this.currentState.id));
    return this;
  }
}
