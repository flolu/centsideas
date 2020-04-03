import { createReducer, on, Action } from '@ngrx/store';
import { IUserState } from '@cents-ideas/models';
import { UserActions } from './user.actions';
import { LOADING_DONE, LOADING_FAIL, LOADING } from '../../helpers/state.helper';

interface IUserReducerState {
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
);

export function reducer(state: IUserReducerState | undefined, action: Action) {
  return userReducer(state, action);
}
