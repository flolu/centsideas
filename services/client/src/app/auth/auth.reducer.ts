import { createReducer, on, Action } from '@ngrx/store';

import { IAuthState } from './auth.state';

const initialState: IAuthState = { loaded: false, loading: false, error: '', user: null };

const authReducer = createReducer(initialState);

export function reducer(state: IAuthState | undefined, action: Action) {
  return authReducer(state, action);
}
