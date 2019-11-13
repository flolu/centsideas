import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { IIdeaViewModel } from '@cents-ideas/models';
import { getIdeas, getIdeasDone, getIdeasFail, createIdea, publishIdeaDone } from './ideas.actions';

export interface IdeasState extends EntityState<IIdeaViewModel> {
  loading: boolean;
  loaded: boolean;
  error: string;
}

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
  on(getIdeas, state => ({ ...state, loading: true, loaded: false, error: '' })),
  on(getIdeasDone, (state, action) =>
    adapter.addMany(action.ideas, { ...state, loaded: true, loading: false, error: '' }),
  ),
  on(getIdeasFail, (state, action) => ({ ...state, loaded: false, loading: false, error: action.error })),
  // FIXME more sophisticated handling of actions
  on(createIdea, state => ({ ...state, loading: true, loaded: false, error: '' })),
  on(publishIdeaDone, (state, action) =>
    adapter.upsertOne(action.published, { ...state, loading: false, loaded: true, error: '' }),
  ),
);

export function reducer(state: IdeasState | undefined, action: Action) {
  return ideasReducer(state, action);
}

export const selectAllIdeas = adapter.getSelectors().selectAll;
