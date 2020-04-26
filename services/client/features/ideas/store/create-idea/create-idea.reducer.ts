import * as __entityTypes from '@ngrx/entity';
import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createReducer, on } from '@ngrx/store';

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

// TOOD implement
export const createIdeaReducer = createReducer(initialState);
