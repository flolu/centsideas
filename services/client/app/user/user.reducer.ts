import { createReducer, on, Action } from '@ngrx/store';

import { IUserState } from '@centsideas/models';

import { UserActions } from './user.actions';
import { Status } from '../../shared/helpers/state.helper';
import { AuthActions } from '../auth/auth.actions';
import { IUserForm } from './user.state';

export interface IUserReducerState {
  persisted: IUserState | null;
  formData: IUserForm | null;
  status: Status;
  // FIXME advanced error handling, where error is displayed for a specific input field
  error: string;
}

const initialState: IUserReducerState = {
  persisted: null,
  formData: null,
  status: Status.Loading,
  error: '',
};

const userReducer = createReducer(
  initialState,
  on(AuthActions.fetchAccessTokenDone, (state, { user }) => ({
    ...state,
    persisted: user,
    status: Status.Loaded,
  })),
  on(AuthActions.confirmLoginDone, (state, { user }) => ({
    ...state,
    persisted: user,
    status: Status.Loaded,
  })),
  on(AuthActions.googleLoginDone, (state, { user }) => ({
    ...state,
    persisted: user,
    status: Status.Loaded,
  })),
  on(AuthActions.logoutDone, state => ({ ...state, persisted: null, status: Status.None })),

  on(UserActions.formChanged, (state, { value }) => ({ ...state, formData: value })),
  on(UserActions.updateUser, state => ({
    ...state,
    status: state.status === Status.Syncing ? Status.PatchSyncing : Status.Syncing,
  })),
  on(UserActions.updateUserFail, (state, { error }) => ({
    ...state,
    status: Status.Error,
    error: error.error,
  })),
  on(UserActions.updateUserDone, (state, { updated }) => ({
    ...state,
    persisted: updated,
    status: state.status === Status.PatchSyncing ? Status.Syncing : Status.Synced,
  })),

  on(UserActions.confirmEmailChange, state => ({ ...state, status: Status.Loading })),
  on(UserActions.confirmEmailChangeFail, (state, { error }) => ({
    ...state,
    status: Status.Error,
    error,
  })),
  on(UserActions.confirmEmailChangeDone, (state, { updated }) => ({
    ...state,
    persisted: updated,
    status: Status.Loaded,
  })),
);

export function reducer(state: IUserReducerState | undefined, action: Action) {
  return userReducer(state, action);
}
