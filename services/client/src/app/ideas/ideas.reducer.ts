import * as __entityTypes from '@ngrx/entity';

import { createReducer, on, Action } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { IIdeaViewModel } from '@cents-ideas/models';

import { IIdeasState } from './ideas.state';
import { IdeasActions } from './ideas.actions';
import { LOADING, LOADING_DONE, LOADING_FAIL } from '../../shared/helpers/state.helper';

const adapter: EntityAdapter<IIdeaViewModel> = createEntityAdapter({
  selectId: (idea: IIdeaViewModel) => idea.id,
});

const initialState: IIdeasState = adapter.getInitialState({
  loaded: false,
  loading: false,
  error: '',
});

const ideasReducer = createReducer(
  initialState,
  on(IdeasActions.getIdeas, state => ({ ...state, ...LOADING })),
  on(IdeasActions.getIdeasDone, (state, action) =>
    adapter.addMany(action.ideas, { ...state, ...LOADING_DONE }),
  ),
  on(IdeasActions.getIdeasFail, (state, { error }) => ({ ...state, ...LOADING_FAIL(error) })),
  on(IdeasActions.getIdeaById, state => ({ ...state, ...LOADING })),
  on(IdeasActions.getIdeaByIdDone, (state, { idea }) =>
    adapter.upsertOne(idea, { ...state, ...LOADING_DONE }),
  ),
  on(IdeasActions.getIdeaByIdFail, (state, { error }) => ({ ...state, ...LOADING_FAIL(error) })),
  on(IdeasActions.createIdea, state => ({ ...state, ...LOADING })),
  on(IdeasActions.createIdeaDone, (state, action) =>
    adapter.upsertOne(
      // TODO merge with existing or reload from backend
      { ...action.created, reviews: [], scores: null, reviewCount: -1 },
      { ...state, loading: false, loaded: true, error: null },
    ),
  ),
  on(IdeasActions.createIdeaFail, (state, { error }) => ({ ...state, ...LOADING_FAIL(error) })),
  on(IdeasActions.updateIdea, state => ({ ...state, ...LOADING })),
  on(IdeasActions.updateIdeaDone, (state, { updated }) =>
    adapter.upsertOne(
      // TODO merge with existing or reload from backend
      { ...updated, reviews: [], scores: null, reviewCount: -1 },
      { ...state, ...LOADING_DONE },
    ),
  ),
  on(IdeasActions.updateIdeaFail, (state, { error }) => ({ ...state, ...LOADING_FAIL(error) })),
  on(IdeasActions.deleteIdea, state => ({ ...state, ...LOADING })),
  on(IdeasActions.deleteIdeaDone, (state, { deleted }) =>
    adapter.upsertOne(
      // TODO merge with existing or reload from backend
      { ...deleted, reviews: [], scores: null, reviewCount: -1 },
      { ...state, ...LOADING_DONE },
    ),
  ),
  on(IdeasActions.deleteIdeaFail, (state, { error }) => ({ ...state, ...LOADING_FAIL(error) })),
  // TODO publish review done
);

export function reducer(state: IIdeasState | undefined, action: Action) {
  return ideasReducer(state, action);
}

export const selectAllIdeas = adapter.getSelectors().selectAll;
export const selectIdeaEntities = adapter.getSelectors().selectEntities;
