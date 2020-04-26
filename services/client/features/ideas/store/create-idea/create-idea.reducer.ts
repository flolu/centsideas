import * as __entityTypes from '@ngrx/entity';

import { createReducer, on, Action } from '@ngrx/store';

import { LoadStatus, SyncStatus } from '@cic/shared';
import { ICreateIdeaReducerState } from './create-idea.state';
import { CreateIdeaActions } from './create-idea.actions';

// TODO autosave drafts
const initialState: ICreateIdeaReducerState = {
  status: SyncStatus.None,
  error: null,
  form: null,
  persisted: null,
};

// TOOD
const reducer = createReducer(initialState);

export function createIdeaReducer(state: ICreateIdeaReducerState | undefined, action: Action) {
  return reducer(state, action);
}
