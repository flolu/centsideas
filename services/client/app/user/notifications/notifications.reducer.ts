import { createReducer, Action, on } from '@ngrx/store';

import { Dtos } from '@centsideas/models';

import {
  ILoadingState,
  initialLoadingState,
  LOADING,
  LOADING_DONE,
  LOADING_FAIL,
} from '../../../shared/helpers/state.helper';
import { NotificationsActions } from './notifications.actions';

export interface INotificationsReducerState extends ILoadingState {
  settings: Dtos.INotificationSettingsDto;
}

const initialState: INotificationsReducerState = {
  ...initialLoadingState,
  settings: {
    sendPushes: false,
    sendEmails: false,
  },
};

const notificationsReducer = createReducer(
  initialState,
  on(NotificationsActions.addPushSub, state => ({ ...state, ...LOADING })),
  on(NotificationsActions.addPushSubDone, (state, { settings }) => ({
    ...state,
    ...LOADING_DONE,
    settings,
  })),
  on(NotificationsActions.addPushSubFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })),
  on(NotificationsActions.updateSettings, state => ({ ...state, ...LOADING })),
  on(NotificationsActions.updateSettingsDone, (state, { settings }) => ({
    ...state,
    ...LOADING_DONE,
    settings,
  })),
  on(NotificationsActions.updateSettingsFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })),
  on(NotificationsActions.getSettings, state => ({ ...state, ...LOADING })),
  on(NotificationsActions.getSettingsDone, (state, { settings }) => ({
    ...state,
    ...LOADING_DONE,
    settings,
  })),
  on(NotificationsActions.getSettingsFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })),
);

export function reducer(state: INotificationsReducerState | undefined, action: Action) {
  return notificationsReducer(state, action);
}
