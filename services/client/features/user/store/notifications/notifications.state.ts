import { SyncStatus } from '@cic/shared';
import { INotificationSettingsState } from '@centsideas/models';

export interface INotificationSettingsForm {
  sendPushes: boolean;
  sendEmails: boolean;
}

export interface INotificationsReducerState {
  persisted: INotificationSettingsState | null;
  formData: INotificationSettingsForm | null;
  status: SyncStatus;
  error: string;
}
