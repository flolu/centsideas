import * as __entityTypes from '@ngrx/entity';
import * as __ngrxStoreTypes from '@ngrx/store/src/models';

import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { IIdeaViewModel } from '@centsideas/models';
import { LoadStatus } from '@cic/shared';
import { IdeasActions } from './ideas.actions';
import { IIdeasReducerState } from './ideas.state';
import { CreateIdeaActions } from '../create-idea';
// TODO for some mysterious reason i can't import this from ../edit-idea
import { EditIdeaActions } from '../edit-idea/edit-idea.actions';

const adapter: EntityAdapter<IIdeaViewModel> = createEntityAdapter({
  selectId: (idea: IIdeaViewModel) => idea.id,
});

const initialState: IIdeasReducerState = adapter.getInitialState({
  pageStatus: LoadStatus.None,
  error: '',
});

export const ideasReducer = createReducer(
  initialState,
  on(IdeasActions.getIdeasDone, (state, action) => adapter.addMany(action.ideas, { ...state })),
  on(IdeasActions.getIdeasFail, (state, { error }) => ({ ...state, error })),
  on(IdeasActions.getIdeaById, state => ({ ...state, pageStatus: LoadStatus.Loading })),
  on(IdeasActions.getIdeaByIdDone, (state, { idea }) =>
    adapter.upsertOne(idea, { ...state, pageStatus: LoadStatus.Loaded }),
  ),
  on(IdeasActions.getIdeaByIdFail, (state, { error }) => ({
    ...state,
    error,
    pageStatus: LoadStatus.Error,
  })),

  on(CreateIdeaActions.createIdeaDone, (state, action) =>
    adapter.upsertOne(
      { ...action.created, reviews: [], scores: null, reviewCount: -1 },
      { ...state },
    ),
  ),

  on(EditIdeaActions.updateIdeaDone, (state, action) =>
    adapter.upsertOne(
      { ...action.updated, reviews: [], scores: null, reviewCount: -1 },
      { ...state },
    ),
  ),
);

export const IdeasReducerSelectors = {
  selectAllIdeas: adapter.getSelectors().selectAll,
  selectIdeaEntities: adapter.getSelectors().selectEntities,
};
