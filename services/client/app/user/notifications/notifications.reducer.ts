import { createReducer, Action, on } from '@ngrx/store';

import { NotificationsActions } from './notifications.actions';
import { INotificationSettingsForm } from './notifications.state';

export interface INotificationsReducerState {
  persisted: INotificationSettingsForm;
  formData: INotificationSettingsForm;
  status: Status;
  error: string;
}

export enum Status {
  Loading = 1,
  Loaded = 2,
  Syncing = 3,
  Synced = 4,
  PatchSyncing = 5,
  Error = 6,
}

const initialState: INotificationsReducerState = {
  persisted: null,
  formData: { sendEmails: false, sendPushes: false },
  status: Status.Loading,
  error: '',
};

const notificationsReducer = createReducer(
  initialState,
  on(NotificationsActions.getSettings, state => ({ ...state, status: Status.Loaded })),
  on(NotificationsActions.getSettingsDone, (state, { settings }) => ({
    ...state,
    status: Status.Loaded,
    persisted: settings,
  })),
  on(NotificationsActions.getSettingsFail, (state, { error }) => ({
    ...state,
    status: Status.Error,
    error,
  })),

  on(NotificationsActions.formChanged, (state, { value }) => ({
    ...state,
    formData: value,
  })),

  on(NotificationsActions.updateSettings, state => ({
    ...state,
    status: state.status === Status.Syncing ? Status.PatchSyncing : Status.Syncing,
  })),
  on(NotificationsActions.updateSettingsDone, state => ({
    ...state,
    status: state.status === Status.PatchSyncing ? Status.Syncing : Status.Synced,
  })),
  on(NotificationsActions.updateSettingsFail, (state, { error }) => ({
    ...state,
    status: Status.Error,
    error,
  })),
);

export function reducer(state: INotificationsReducerState | undefined, action: Action) {
  return notificationsReducer(state, action);
}
