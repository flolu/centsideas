import { createReducer, on, Action } from '@ngrx/store';

import { LoadStatus } from '@cic/helpers';
import { AuthActions } from './auth.actions';

export interface ILoginReducerState {
  status: LoadStatus;
  error: string;
}

const initialState: ILoginReducerState = {
  status: LoadStatus.None,
  error: '',
};

const loginPageReducer = createReducer(
  initialState,
  on(AuthActions.login, state => ({ ...state, status: LoadStatus.Loading })),
  on(AuthActions.loginDone, state => ({ ...state, status: LoadStatus.Loaded })),
  on(AuthActions.loginFail, (state, { error }) => ({ ...state, status: LoadStatus.Error, error })),

  on(AuthActions.confirmLogin, state => ({ ...state, status: LoadStatus.Loading })),
  on(AuthActions.confirmLoginDone, state => ({ ...state, status: LoadStatus.Loaded })),
  on(AuthActions.confirmLoginFail, (state, { error }) => ({
    ...state,
    status: LoadStatus.Error,
    error,
  })),

  on(AuthActions.googleLogin, state => ({ ...state, status: LoadStatus.Loading })),
  on(AuthActions.googleLoginDone, state => ({ ...state, status: LoadStatus.Loaded })),
  on(AuthActions.googleLoginFail, (state, { error }) => ({
    ...state,
    status: LoadStatus.Error,
    error,
  })),

  on(AuthActions.googleLoginRedirect, state => ({ ...state, status: LoadStatus.Loading })),
  on(AuthActions.googleLoginRedirectDone, state => ({ ...state, status: LoadStatus.Loaded })),
  on(AuthActions.googleLoginRedirectFail, (state, { error }) => ({
    ...state,
    status: LoadStatus.Error,
    error,
  })),
);

export function reducer(state: ILoginReducerState | undefined, action: Action) {
  return loginPageReducer(state, action);
}
