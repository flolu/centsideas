import { createReducer, on, Action } from '@ngrx/store';

import { IIdeasState } from './ideas.state';
import { IdeasActions } from './ideas.actions';
import { LOADING, LOADING_DONE, LOADING_FAIL } from '../../shared/helpers/state.helper';

const initialState: IIdeasState = { loaded: false, loading: false, error: '' };

const ideasReducer = createReducer(
  initialState,
  on(IdeasActions.getIdeas, state => ({ ...state, ...LOADING })),
  on(IdeasActions.getIdeasDone, (state, { ideas }) => ({ ...state, ...LOADING_DONE })),
  on(IdeasActions.getIdeasFail, (state, { error }) => ({ ...state, ...LOADING_FAIL(error) })),
  on(IdeasActions.getIdeaById, state => ({ ...state, ...LOADING })),
  on(IdeasActions.getIdeaByIdDone, (state, { idea }) => ({ ...state, ...LOADING_DONE })),
  on(IdeasActions.getIdeaByIdFail, (state, { error }) => ({ ...state, ...LOADING_FAIL(error) })),
  on(IdeasActions.createIdea, state => ({ ...state, ...LOADING })),
  on(IdeasActions.createIdeaDone, (state, { created }) => ({ ...state, ...LOADING_DONE })),
  on(IdeasActions.createIdeaFail, (state, { error }) => ({ ...state, ...LOADING_FAIL(error) })),
  on(IdeasActions.updateIdea, state => ({ ...state, ...LOADING })),
  on(IdeasActions.updateIdeaDone, (state, { updated }) => ({ ...state, ...LOADING_DONE })),
  on(IdeasActions.updateIdeaFail, (state, { error }) => ({ ...state, ...LOADING_FAIL(error) })),
  on(IdeasActions.deleteIdea, state => ({ ...state, ...LOADING })),
  on(IdeasActions.deleteIdeaDone, (state, { deleted }) => ({ ...state, ...LOADING_DONE })),
  on(IdeasActions.deleteIdeaFail, (state, { error }) => ({ ...state, ...LOADING_FAIL(error) })),
);

export function reducer(state: IIdeasState | undefined, action: Action) {
  return ideasReducer(state, action);
}

// export const selectAllIdeas = adapter.getSelectors().selectAll;
// export const selectIdeaEntities = adapter.getSelectors().selectEntities;
