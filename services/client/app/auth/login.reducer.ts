import { createReducer, on, Action } from '@ngrx/store';

import {
  ILoadingState,
  initialLoadingState,
  LOADING,
  LOADING_FAIL,
  LOADING_DONE,
} from '../../shared/helpers/state.helper';
import { AuthActions } from './auth.actions';

export type ILoginReducerState = ILoadingState;

const initialState: ILoadingState = {
  ...initialLoadingState,
};

const loginPageReducer = createReducer(
  initialState,
  on(AuthActions.login, state => ({
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
  })),

  on(AuthActions.confirmLogin, state => ({ ...state, ...LOADING })),
  on(AuthActions.confirmLoginDone, state => ({ ...state, LOADING_DONE })),
  on(AuthActions.confirmLoginFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })),

  on(AuthActions.googleLogin, state => ({ ...state, ...LOADING })),
  on(AuthActions.googleLoginDone, state => ({ ...state, ...LOADING_DONE })),
  on(AuthActions.googleLoginFail, (state, { error }) => ({ ...state, ...LOADING_FAIL(error) })),

  on(AuthActions.googleLoginRedirect, state => ({ ...state, ...LOADING })),
  on(AuthActions.googleLoginRedirectDone, state => ({ ...state, ...LOADING_DONE })),
  on(AuthActions.googleLoginRedirectFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })),
);

export function reducer(state: ILoginReducerState | undefined, action: Action) {
  return loginPageReducer(state, action);
}
