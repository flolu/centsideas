import { EventEntity, ISnapshot } from '@centsideas/event-sourcing';
import { INotificationSettingsState } from '@centsideas/models';

import { notificationSettingsCommitFunctions } from './events';

export class NotificationSettings extends EventEntity<INotificationSettingsState> {
  static initialState: INotificationSettingsState = {
    id: '',
    userId: '',
    lastEventId: '',
  };

  constructor(snapshot?: ISnapshot<INotificationSettingsState>) {
    if (snapshot && snapshot.state) {
      super(notificationSettingsCommitFunctions, snapshot.state);
      this.lastPersistedEventId = snapshot.lastEventId;
    } else super(notificationSettingsCommitFunctions, NotificationSettings.initialState);
  }
}
