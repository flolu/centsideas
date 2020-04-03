import { createReducer, on, Action } from '@ngrx/store';

import { IAuthState } from './users.state';
import { UsersActions } from './users.actions';
import { LOADING, LOADING_FAIL, LOADING_DONE } from '../../helpers/state.helper';

const initialState: IAuthState = {
  loaded: false,
  loading: false,
  error: '',
  user: null,
  initialized: false,
};

const authReducer = createReducer(
  initialState,
  on(UsersActions.login, state => ({
    ...state,
    ...LOADING,
  })),
  on(UsersActions.loginFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })),
  on(UsersActions.loginDone, state => ({
    ...state,
    ...LOADING_DONE,
  })),
  on(UsersActions.authenticate, state => ({ ...state, initialized: false })),
  on(UsersActions.authenticateFail, (state, { error }) => ({
    ...state,
    initialized: true,
    error,
  })),
  on(UsersActions.authenticateDone, (state, action) => ({
    ...state,
    ...LOADING_DONE,
    initialized: true,
    user: action.user,
  })),
  on(UsersActions.confirmLogin, state => ({ ...state, ...LOADING })),
  on(UsersActions.confirmLoginFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })),
  on(UsersActions.confirmLoginDone, (state, action) => ({
    ...state,
    ...LOADING_DONE,
    user: action.user,
  })),
  on(UsersActions.updateUser, state => ({
    ...state,
    ...LOADING,
  })),
  on(UsersActions.updateUserFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })),
  on(UsersActions.updateUserDone, (state, { updated }) => ({
    ...state,
    ...LOADING_DONE,
    user: updated,
  })),
  on(UsersActions.confirmEmailChange, state => ({
    ...state,
    ...LOADING,
  })),
  on(UsersActions.confirmEmailChangeFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })),
  on(UsersActions.confirmEmailChangeDone, (state, action) => ({
    ...state,
    ...LOADING_DONE,
    user: action.updated,
  })),
);

export function reducer(state: IAuthState | undefined, action: Action) {
  return authReducer(state, action);
}
