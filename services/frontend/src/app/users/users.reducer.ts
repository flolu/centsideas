import { createReducer, on, Action } from '@ngrx/store';

import { UsersActions } from '.';
import { IUsersState } from './users.state';

const initialState: IUsersState = {
  loaded: false,
  loading: false,
  error: null,
  user: null,
};

const usersReducer = createReducer(
  initialState,
  on(UsersActions.login, state => ({ ...state })),
);

export function reducer(state: IUsersState | undefined, action: Action) {
  return usersReducer(state, action);
}
