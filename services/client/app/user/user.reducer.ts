import { createReducer, on, Action } from '@ngrx/store';

import { IUserState } from '@centsideas/models';
import { SyncStatus } from '@cic/helpers';
import { UserActions } from './user.actions';
import { AuthActions } from '../auth/auth.actions';
import { IUserForm } from './user.state';

export interface IUserReducerState {
  persisted: IUserState | null;
  formData: IUserForm | null;
  status: SyncStatus;
  // FIXME advanced error handling, where error is displayed for a specific input field
  error: string;
}

const initialState: IUserReducerState = {
  persisted: null,
  formData: null,
  status: SyncStatus.Loading,
  error: '',
};

const userReducer = createReducer(
  initialState,
  on(AuthActions.fetchAccessTokenDone, (state, { user }) => ({
    ...state,
    persisted: user,
    status: SyncStatus.Loaded,
  })),
  on(AuthActions.confirmLoginDone, (state, { user }) => ({
    ...state,
    persisted: user,
    status: SyncStatus.Loaded,
  })),
  on(AuthActions.googleLoginDone, (state, { user }) => ({
    ...state,
    persisted: user,
    status: SyncStatus.Loaded,
  })),
  on(AuthActions.logoutDone, state => ({ ...state, persisted: null, status: SyncStatus.None })),

  on(UserActions.formChanged, (state, { value }) => ({ ...state, formData: value })),
  on(UserActions.updateUser, state => ({
    ...state,
    status: state.status === SyncStatus.Syncing ? SyncStatus.PatchSyncing : SyncStatus.Syncing,
  })),
  on(UserActions.updateUserFail, (state, { error }) => ({
    ...state,
    status: SyncStatus.Error,
    error: error.error,
  })),
  on(UserActions.updateUserDone, (state, { updated }) => ({
    ...state,
    persisted: updated,
    status: state.status === SyncStatus.PatchSyncing ? SyncStatus.Syncing : SyncStatus.Synced,
  })),

  on(UserActions.confirmEmailChange, state => ({ ...state, status: SyncStatus.Loading })),
  on(UserActions.confirmEmailChangeFail, (state, { error }) => ({
    ...state,
    status: SyncStatus.Error,
    error,
  })),
  on(UserActions.confirmEmailChangeDone, (state, { updated }) => ({
    ...state,
    persisted: updated,
    status: SyncStatus.Loaded,
  })),
);

export function reducer(state: IUserReducerState | undefined, action: Action) {
  return userReducer(state, action);
}
