import { createReducer, Action, on } from '@ngrx/store';

import { NotificationsActions } from './notifications.actions';
import { INotificationSettingsForm } from './notifications.state';
import { Status } from '../../../shared/helpers/state.helper';

export interface INotificationsReducerState {
  // FIXME persisted state is inaccurate
  persisted: INotificationSettingsForm | null;
  formData: INotificationSettingsForm | null;
  status: Status;
  error: string;
}

const initialState: INotificationsReducerState = {
  persisted: null,
  formData: null,
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

  on(NotificationsActions.formChanged, (state, { value }) => ({ ...state, formData: value })),

  on(NotificationsActions.updateSettings, state => ({
    ...state,
    status: state.status === Status.Syncing ? Status.PatchSyncing : Status.Syncing,
  })),
  on(NotificationsActions.updateSettingsDone, (state, { settings }) => ({
    ...state,
    status: state.status === Status.PatchSyncing ? Status.Syncing : Status.Synced,
    persisted: settings,
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
