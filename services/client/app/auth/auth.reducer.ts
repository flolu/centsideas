import { createReducer, on, Action } from '@ngrx/store';

import { AuthActions } from './auth.actions';
import { LoadStatus } from '@cic/helpers';

export interface IAuthReducerState {
  error: string;
  accessToken: string;
  status: LoadStatus;
}

const initialState: IAuthReducerState = {
  error: '',
  status: LoadStatus.None,
  accessToken: '',
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.fetchAccessToken, state => ({ ...state, status: LoadStatus.Loading })),
  on(AuthActions.fetchAccessTokenDone, (state, { accessToken }) => ({
    ...state,
    status: LoadStatus.Loaded,
    accessToken,
  })),
  on(AuthActions.fetchAccessTokenFail, (state, { error }) => ({
    ...state,
    status: LoadStatus.Error,
    error,
  })),

  on(AuthActions.logoutDone, state => ({ ...state, accessToken: '' })),

  on(AuthActions.confirmLoginDone, (state, { accessToken }) => ({
    ...state,
    accessToken,
    status: LoadStatus.Loaded,
  })),
  on(AuthActions.googleLoginDone, (state, { accessToken }) => ({
    ...state,
    accessToken,
    status: LoadStatus.Loaded,
  })),
);

export function reducer(state: IAuthReducerState | undefined, action: Action) {
  return authReducer(state, action);
}
