import * as __entityTypes from '@ngrx/entity';

import { createReducer, on, Action } from '@ngrx/store';

import { LOADING, LOADING_DONE, LOADING_FAIL } from '../../shared/helpers/state.helper';
import { IIdeaEditState } from './ideas.state';
import { IdeasActions } from './ideas.actions';

const initialState: IIdeaEditState = {
  loading: false,
  loaded: false,
  error: '',
  editing: false,
  form: { title: '', description: '' },
  ideaId: '',
};

const ideasReducer = createReducer(
  initialState,
  on(IdeasActions.editIdeaSetForm, (state, { idea }) => ({
    ...state,
    form: { title: idea.title, description: idea.description },
    ideaId: idea.id,
    editing: true,
  })),
  on(IdeasActions.cancelEditIdea, state => ({
    ...state,
    editing: false,
    form: initialState.form,
    ideaId: '',
  })),
  on(IdeasActions.updateIdea, state => ({ ...state, ...LOADING })),
  on(IdeasActions.updateIdeaDone, state => ({
    ...state,
    ...LOADING_DONE,
    editing: false,
    ideaId: '',
    form: initialState.form,
  })),
  on(IdeasActions.updateIdeaFail, (state, { error }) => ({ ...state, ...LOADING_FAIL(error) })),
  on(IdeasActions.ideaFormChanged, (state, { value }) => ({ ...state, form: value })),
  on(IdeasActions.deleteIdeaDone, state => ({
    ...state,
    editing: false,
    form: initialState.form,
    ideaId: '',
  })),
);

export function reducer(state: IIdeaEditState | undefined, action: Action) {
  return ideasReducer(state, action);
}
