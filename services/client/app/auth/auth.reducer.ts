import { createReducer, on, Action } from '@ngrx/store';

import { AuthActions } from './auth.actions';
import { LOADING, LOADING_FAIL, LOADING_DONE } from '../../shared/helpers/state.helper';

export interface IAuthReducerState {
  error: string;
  initializing: boolean;
  initialized: boolean;
  accessToken: string;
}

const initialState: IAuthReducerState = {
  error: '',
  initialized: false,
  initializing: true,
  accessToken: '',
};

const authReducer = createReducer(
  initialState,
  // TODO move login into a login reducer with own loading, loaded ,etc
  /* on(AuthActions.login, state => ({
    ...state,
    ...LOADING,
  })),
  on(AuthActions.loginFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })),
  on(AuthActions.loginDone, state => ({
    ...state,
    ...LOADING_DONE,
  })), */
  /* on(AuthActions.confirmLogin, state => ({ ...state, ...LOADING })),
  on(AuthActions.confirmLoginFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })), */

  on(AuthActions.fetchAccessToken, state => ({ ...state, ...LOADING })),
  on(AuthActions.fetchAccessTokenDone, (state, { accessToken }) => ({
    ...state,
    ...LOADING_DONE,
    accessToken,
    initializing: false,
    initialized: true,
  })),
  on(AuthActions.fetchAccessTokenFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
    initializing: false,
    initialized: true,
  })),
  on(AuthActions.confirmLoginDone, (state, { accessToken }) => ({
    ...state,
    accessToken,
    initializing: false,
    initialized: true,
  })),
  on(AuthActions.logout, state => ({ ...state })),
  on(AuthActions.logoutDone, state => ({ ...state, accessToken: '' })),
  on(AuthActions.logoutFail, (state, { error }) => ({ ...state })),
  on(AuthActions.googleLoginDone, (state, { accessToken }) => ({ ...state, accessToken })),
);

export function reducer(state: IAuthReducerState | undefined, action: Action) {
  return authReducer(state, action);
}
