import { createReducer, on, Action } from '@ngrx/store';

import { IUserState } from '@cents-ideas/models';

import { AuthActions } from './auth.actions';
import { LOADING, LOADING_FAIL, LOADING_DONE } from '../../helpers/state.helper';

export interface IAuthReducerState {
  loading: boolean;
  loaded: boolean;
  error: string;
  initialized: boolean;
}

const initialState: IAuthReducerState = {
  loaded: false,
  loading: false,
  error: '',
  initialized: false,
};

const authReducer = createReducer(
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
  on(AuthActions.authenticate, state => ({ ...state, initialized: false })),
  on(AuthActions.authenticateFail, (state, { error }) => ({
    ...state,
    initialized: true,
    error,
  })),
  on(AuthActions.authenticateDone, (state, action) => ({
    ...state,
    ...LOADING_DONE,
    initialized: true,
    user: action.user,
  })),
  on(AuthActions.confirmLogin, state => ({ ...state, ...LOADING })),
  on(AuthActions.confirmLoginFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })),
  on(AuthActions.confirmLoginDone, (state, action) => ({
    ...state,
    ...LOADING_DONE,
    user: action.user,
  })),
  on(AuthActions.confirmEmailChange, state => ({
    ...state,
    ...LOADING,
  })),
  on(AuthActions.confirmEmailChangeFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })),
  on(AuthActions.confirmEmailChangeDone, (state, action) => ({
    ...state,
    ...LOADING_DONE,
    user: action.updated,
  })),
);

export function reducer(state: IAuthReducerState | undefined, action: Action) {
  return authReducer(state, action);
}
