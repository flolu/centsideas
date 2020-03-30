import { createReducer, on, Action } from '@ngrx/store';

import { UsersActions } from '.';
import { IUsersState } from './users.state';

const initialState: IUsersState = {
  loaded: false,
  loading: false,
  error: null,
  user: null,
  initialized: false,
};

const usersReducer = createReducer(
  initialState,
  on(UsersActions.login, state => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(UsersActions.loginFail, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error,
  })),
  on(UsersActions.loginDone, state => ({
    loading: false,
    loaded: true,
    error: null,
  })),
  on(UsersActions.confirmSignUpDone, (state, action) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    user: action.user,
    token: action.token,
  })),
  on(UsersActions.authenticate, state => ({ ...state, initialized: false })),
  on(UsersActions.authenticateFail, state => ({ ...state, initialized: true })),
  on(UsersActions.authenticateDone, (state, action) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    user: action.user,
    token: action.token,
    initialized: true,
  })),
  on(UsersActions.updateUser, state => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(UsersActions.updateUserFail, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error,
  })),
  on(UsersActions.updateUserDone, (state, { updated }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    user: updated,
  })),
);

export function reducer(state: IUsersState | undefined, action: Action) {
  return usersReducer(state, action);
}
