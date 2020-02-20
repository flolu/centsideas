import { createReducer, on, Action } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { IIdeaViewModel } from '@cents-ideas/models';
import { IdeasState } from './ideas.state';
import * as IdeasActions from './ideas.actions';
import { ReviewsActions } from '@ci-frontend/reviews';

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
  on(IdeasActions.getIdeas, state => ({ ...state, loading: true, loaded: false, error: null })),
  on(IdeasActions.getIdeasDone, (state, action) =>
    adapter.addMany(action.ideas, { ...state, loaded: true, loading: false, error: null }),
  ),
  on(IdeasActions.getIdeasFail, (state, { error }) => ({ ...state, loaded: false, loading: false, error })),
  on(IdeasActions.createIdea, state => ({ ...state, loading: true, loaded: false, error: null })),
  on(IdeasActions.createIdeaDone, (state, action) =>
    adapter.upsertOne(
      { ...action.created, reviews: [], scores: null, reviewCount: -1 },
      { ...state, loading: false, loaded: true, error: null },
    ),
  ),
  on(IdeasActions.getIdeaById, state => ({ ...state, loading: true, loaded: false, error: null })),
  on(IdeasActions.getIdeaByIdDone, (state, action) =>
    adapter.upsertOne(action.idea, { ...state, loaded: true, loading: false, error: null }),
  ),
  on(IdeasActions.getIdeaByIdFail, (state, { error }) => ({ ...state, loading: false, loaded: false, error })),
  on(ReviewsActions.publishReviewDone, (state, { published }) => {
    const idea = state.entities[published.ideaId];
    const updated: IIdeaViewModel = { ...idea, reviews: [published, ...idea.reviews] };
    return {
      ...state,
      entities: { ...state.entities, [idea.id]: updated },
    };
  }),
);

export function reducer(state: IdeasState | undefined, action: Action) {
  return ideasReducer(state, action);
}

export const selectAllIdeas = adapter.getSelectors().selectAll;
export const selectIdeaEntities = adapter.getSelectors().selectEntities;
