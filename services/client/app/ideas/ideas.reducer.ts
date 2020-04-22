import * as __entityTypes from '@ngrx/entity';

import { createReducer, on, Action } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { IIdeaViewModel } from '@centsideas/models';

import { IIdeasState } from './ideas.state';
import { IdeasActions } from './ideas.actions';
import { LoadStatus } from '../../shared/helpers/state.helper';

const adapter: EntityAdapter<IIdeaViewModel> = createEntityAdapter({
  selectId: (idea: IIdeaViewModel) => idea.id,
});

const initialState: IIdeasState = adapter.getInitialState({
  status: LoadStatus.None,
  error: '',
});

const ideasReducer = createReducer(
  initialState,
  on(IdeasActions.getIdeas, state => ({ ...state, status: LoadStatus.Loading })),
  on(IdeasActions.getIdeasDone, (state, action) =>
    adapter.addMany(action.ideas, { ...state, status: LoadStatus.Loaded }),
  ),
  on(IdeasActions.getIdeasFail, (state, { error }) => ({
    ...state,
    error,
    status: LoadStatus.Error,
  })),
  on(IdeasActions.getIdeaById, state => ({ ...state, status: LoadStatus.Loading })),
  on(IdeasActions.getIdeaByIdDone, (state, { idea }) =>
    adapter.upsertOne(idea, { ...state, status: LoadStatus.Loaded }),
  ),
  on(IdeasActions.getIdeaByIdFail, (state, { error }) => ({
    ...state,
    error,
    status: LoadStatus.Error,
  })),
  on(IdeasActions.createIdea, state => ({ ...state, status: LoadStatus.Loading })),
  on(IdeasActions.createIdeaDone, (state, action) =>
    adapter.upsertOne(
      { ...action.created, reviews: [], scores: null, reviewCount: -1 },
      { ...state, loading: false, loaded: true, error: null },
    ),
  ),
  on(IdeasActions.createIdeaFail, (state, { error }) => ({
    ...state,
    error,
    status: LoadStatus.Error,
  })),
  on(IdeasActions.updateIdeaDone, (state, { updated }) =>
    adapter.upsertOne({ ...updated, reviews: [], scores: null, reviewCount: -1 }, { ...state }),
  ),
  on(IdeasActions.deleteIdea, state => ({ ...state, status: LoadStatus.Loading })),
  on(IdeasActions.deleteIdeaDone, (state, { deleted }) =>
    adapter.upsertOne(
      { ...deleted, reviews: [], scores: null, reviewCount: -1 },
      { ...state, status: LoadStatus.Loaded },
    ),
  ),
  on(IdeasActions.deleteIdeaFail, (state, { error }) => ({
    ...state,
    error,
    status: LoadStatus.Error,
  })),
);

export function reducer(state: IIdeasState | undefined, action: Action) {
  return ideasReducer(state, action);
}

export const selectAllIdeas = adapter.getSelectors().selectAll;
export const selectIdeaEntities = adapter.getSelectors().selectEntities;
