import { EventEntity, ISnapshot, initialEntityBaseState } from '@centsideas/event-sourcing';
import { INotificationState } from '@centsideas/models';

import { notificationsCommitFunctions } from './events';

export class Notification extends EventEntity<INotificationState> {
  static initialState: INotificationState = {
    ...initialEntityBaseState,
  };

  constructor(snapshot?: ISnapshot<INotificationState>) {
    if (snapshot && snapshot.state) {
      super(notificationsCommitFunctions, snapshot.state);
      this.persistedState.lastEventId = snapshot.lastEventId;
    } else super(notificationsCommitFunctions, Notification.initialState);
  }
}
