import * as __entityTypes from '@ngrx/entity';

import { createReducer, on, Action } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { IIdeaViewModel } from '@centsideas/models';
import { LoadStatus } from '@cic/shared';
import { IdeasActions } from './ideas.actions';
import { IIdeasReducerState } from './ideas.state';
import { CreateIdeaActions } from '../create-idea';
// TODO for some mysterious reason i can't import this from ../edit-idea ?!?!?
import { EditIdeaActions } from '../edit-idea/edit-idea.actions';

const adapter: EntityAdapter<IIdeaViewModel> = createEntityAdapter({
  selectId: (idea: IIdeaViewModel) => idea.id,
});

const initialState: IIdeasReducerState = adapter.getInitialState({
  status: LoadStatus.None,
  error: '',
});

const reducer = createReducer(
  initialState,
  on(IdeasActions.getIdeasDone, (state, action) => adapter.addMany(action.ideas, { ...state })),
  on(IdeasActions.getIdeasFail, (state, { error }) => ({ ...state, error })),
  on(IdeasActions.getIdeaByIdDone, (state, { idea }) => adapter.upsertOne(idea, { ...state })),
  on(IdeasActions.getIdeaByIdFail, (state, { error }) => ({ ...state, error })),

  on(CreateIdeaActions.createIdeaDone, (state, action) =>
    adapter.upsertOne(
      // TODO optimize frontend view model strategy
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

// TODO are those ugly duplicate reducer functions needed?
export function ideasReducer(state: IIdeasReducerState | undefined, action: Action) {
  return reducer(state, action);
}

export const IdeasReducerSelectors = {
  selectAllIdeas: adapter.getSelectors().selectAll,
  selectIdeaEntities: adapter.getSelectors().selectEntities,
};
