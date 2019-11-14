import { createReducer, on, Action } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { IIdeaViewModel } from '@cents-ideas/models';
import { IdeasState } from './ideas.state';
import * as IdeasActions from './ideas.actions';

const adapter: EntityAdapter<IIdeaViewModel> = createEntityAdapter({
  selectId: (i: IIdeaViewModel) => i.id,
});
const initialState: IdeasState = adapter.getInitialState({
  loading: false,
  loaded: false,
  error: '',
});

const ideasReducer = createReducer(
  initialState,
  on(IdeasActions.getIdeas, state => ({ ...state, loading: true, loaded: false, error: '' })),
  on(IdeasActions.getIdeasDone, (state, action) =>
    adapter.addMany(action.ideas, { ...state, loaded: true, loading: false, error: '' }),
  ),
  on(IdeasActions.getIdeasFail, (state, action) => ({ ...state, loaded: false, loading: false, error: action.error })),
  // FIXME more sophisticated handling of actions
  on(IdeasActions.createIdea, state => ({ ...state, loading: true, loaded: false, error: '' })),
  on(IdeasActions.publishIdeaDone, (state, action) =>
    adapter.upsertOne(action.published, { ...state, loading: false, loaded: true, error: '' }),
  ),
);

export function reducer(state: IdeasState | undefined, action: Action) {
  return ideasReducer(state, action);
}

export const selectAllIdeas = adapter.getSelectors().selectAll;
