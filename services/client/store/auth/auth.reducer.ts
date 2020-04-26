import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createReducer, on, Action } from '@ngrx/store';

import { LoadStatus } from '@cic/shared';
import { AuthActions } from './auth.actions';
import { IAuthReducerState } from './auth.state';

const initialState: IAuthReducerState = {
  user: null,
  error: '',
  status: LoadStatus.None,
  accessToken: '',
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.fetchAccessToken, state => ({ ...state, status: LoadStatus.Loading })),
  on(AuthActions.fetchAccessTokenDone, (state, { accessToken, user }) => ({
    ...state,
    status: LoadStatus.Loaded,
    user,
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
    user,
    status: LoadStatus.Loaded,
  })),
  on(AuthActions.googleLoginDone, (state, { accessToken, user }) => ({
    ...state,
    accessToken,
    user,
    status: LoadStatus.Loaded,
  })),
  on(AuthActions.overwriteUser, (state, { user }) => ({ ...state, user })),
);
