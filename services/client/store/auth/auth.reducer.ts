import { createReducer, on, Action } from '@ngrx/store';

import { LoadStatus } from '@cic/shared';
import { AuthActions } from './auth.actions';
import { IAuthReducerState } from './auth.state';

const initialState: IAuthReducerState = {
  // TODO rename to just user
  persistedUser: null,
  error: '',
  status: LoadStatus.None,
  accessToken: '',
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.fetchAccessToken, state => ({ ...state, status: LoadStatus.Loading })),
  on(AuthActions.fetchAccessTokenDone, (state, { accessToken, user }) => ({
    ...state,
    status: LoadStatus.Loaded,
    persistedUser: user,
    accessToken,
  })),
  on(AuthActions.fetchAccessTokenFail, (state, { error }) => ({
    ...state,
    status: LoadStatus.Error,
    error,
  })),

  on(AuthActions.logoutDone, state => ({ ...state, accessToken: '' })),

  on(AuthActions.confirmLoginDone, (state, { accessToken, user }) => ({
    ...state,
    accessToken,
    persistedUser: user,
    status: LoadStatus.Loaded,
  })),
  on(AuthActions.googleLoginDone, (state, { accessToken, user }) => ({
    ...state,
    accessToken,
    persistedUser: user,
    status: LoadStatus.Loaded,
  })),
  // TODO can't import user actions because they are lazy loaded... find better solution!
  /* on(UserActions.confirmEmailChangeDone, (state, { updated }) => ({
    ...state,
    persistedUser: updated,
  })), */
);

export function reducer(state: IAuthReducerState | undefined, action: Action) {
  return authReducer(state, action);
}
