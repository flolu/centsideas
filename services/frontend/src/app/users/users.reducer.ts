import { createReducer, on, Action } from '@ngrx/store';

import { UsersActions } from '.';
import { IUsersState } from './users.state';

const initialState: IUsersState = {
  loaded: false,
  loading: false,
  error: null,
  user: null,
  activationUrl: null,
  token: null,
};

const usersReducer = createReducer(
  initialState,
  on(UsersActions.login, state => ({ ...state, loading: true, loaded: false, error: null })),
  on(UsersActions.loginFail, (state, { error }) => ({ ...state, loading: false, loaded: false, error })),
  on(UsersActions.loginRequested, (state, action) => ({
    ...state,
    activationUrl: action.activationRoute,
    token: action.token,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(UsersActions.signUpRequested, (state, action) => ({
    ...state,
    activationUrl: action.activationRoute,
    token: action.token,
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
);

export function reducer(state: IUsersState | undefined, action: Action) {
  return usersReducer(state, action);
}
