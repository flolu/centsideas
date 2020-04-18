import { createReducer, on, Action } from '@ngrx/store';
import { IUserState } from '@centsideas/models';
import { UserActions } from './user.actions';
import { LOADING_DONE, LOADING_FAIL, LOADING } from '../../shared/helpers/state.helper';
import { AuthActions } from '../auth/auth.actions';

export interface IUserReducerState {
  loading: boolean;
  loaded: boolean;
  error: string;
  user: IUserState | null;
}

const initialState: IUserReducerState = {
  loading: false,
  loaded: false,
  error: '',
  user: null,
};

const userReducer = createReducer(
  initialState,
  on(UserActions.updateUser, state => ({
    ...state,
    ...LOADING,
  })),
  on(UserActions.updateUserFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })),
  on(UserActions.updateUserDone, (state, { updated }) => ({
    ...state,
    ...LOADING_DONE,
    user: updated,
  })),
  on(UserActions.confirmEmailChange, state => ({ ...state, ...LOADING })),
  on(UserActions.confirmEmailChangeFail, (state, { error }) => ({
    ...state,
    ...LOADING_FAIL(error),
  })),
  on(UserActions.confirmEmailChangeDone, (state, { updated }) => ({
    ...state,
    ...LOADING_DONE,
    user: updated,
  })),
  on(AuthActions.confirmLoginDone, (state, { user }) => ({ ...state, user })),
  on(AuthActions.fetchAccessTokenDone, (state, { user }) => ({ ...state, user })),
  on(AuthActions.logoutDone, state => ({ ...state, user: null })),
  on(AuthActions.googleLoginDone, (state, { user }) => ({ ...state, user })),
);

export function reducer(state: IUserReducerState | undefined, action: Action) {
  return userReducer(state, action);
}
