import { createReducer, on, Action } from '@ngrx/store';

import { IIdeasState } from './ideas.state';

const initialState: IIdeasState = { loaded: false, loading: false, error: '' };

const ideasReducer = createReducer(initialState);

export function reducer(state: IIdeasState | undefined, action: Action) {
  return ideasReducer(state, action);
}
