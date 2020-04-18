import { EventEntity, ISnapshot } from '@centsideas/event-sourcing';
import { INotificationState } from '@centsideas/models';

import { notificationsCommitFunctions } from './events';

export class Notification extends EventEntity<INotificationState> {
  static initialState: INotificationState = {
    id: '',
    lastEventId: '',
  };

  constructor(snapshot?: ISnapshot<INotificationState>) {
    if (snapshot && snapshot.state) {
      super(notificationsCommitFunctions, snapshot.state);
      this.lastPersistedEventId = snapshot.lastEventId;
    } else super(notificationsCommitFunctions, Notification.initialState);
  }
}
