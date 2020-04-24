import * as __entityTypes from '@ngrx/entity';

import { createReducer, on, Action } from '@ngrx/store';

import { LoadStatus } from '@cic/helpers';
import { IIdeaEditState } from './ideas.state';
import { IdeasActions } from './ideas.actions';

const initialState: IIdeaEditState = {
  error: '',
  editing: false,
  form: { title: '', description: '' },
  ideaId: '',
  status: LoadStatus.None,
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
  on(IdeasActions.updateIdea, state => ({ ...state, status: LoadStatus.Loading })),
  on(IdeasActions.updateIdeaDone, state => ({
    ...state,
    status: LoadStatus.Loaded,
    editing: false,
    ideaId: '',
    form: initialState.form,
  })),
  on(IdeasActions.updateIdeaFail, (state, { error }) => ({
    ...state,
    error,
    status: LoadStatus.Error,
  })),
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
