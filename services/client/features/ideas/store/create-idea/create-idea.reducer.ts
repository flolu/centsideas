import { createReducer, on } from '@ngrx/store';

import { SyncStatus } from '@cic/shared';
import { ICreateIdeaReducerState } from './create-idea.state';
import { CreateIdeaActions } from './create-idea.actions';

// FIXME autosave drafts when creating idea (max one draft per user.. so that it doesn't get to complicated)
const initialState: ICreateIdeaReducerState = {
  status: SyncStatus.None,
  error: null,
  form: null,
  persisted: null,
};

export const createIdeaReducer = createReducer(
  initialState,
  on(CreateIdeaActions.createIdea, state => ({
    ...state,
    status: state.status === SyncStatus.Syncing ? SyncStatus.PatchSyncing : SyncStatus.Syncing,
  })),
  on(CreateIdeaActions.createIdeaDone, (state, { created }) => ({
    ...state,
    persisted: created,
    status: state.status === SyncStatus.PatchSyncing ? SyncStatus.Syncing : SyncStatus.Synced,
  })),
  on(CreateIdeaActions.createIdeaFail, (state, { error }) => ({
    ...state,
    error,
    status: SyncStatus.Error,
  })),
);
