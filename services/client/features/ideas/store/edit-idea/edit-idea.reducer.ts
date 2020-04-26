import * as __entityTypes from '@ngrx/entity';

import { createReducer, on, Action } from '@ngrx/store';

import { LoadStatus } from '@cic/shared';
import { EditIdeaActions } from './edit-idea.actions';
import { IEditIdeaReducerState } from './edit-idea.state';

const initialState: IEditIdeaReducerState = {
  status: LoadStatus.None,
  ideaId: null,
  error: null,
  form: null,
  editing: false,
};

const reducer = createReducer(
  initialState,
  on(EditIdeaActions.editIdeaSetForm, (state, { idea }) => ({
    ...state,
    form: { title: idea.title, description: idea.description },
    ideaId: idea.id,
    editing: true,
  })),
  on(EditIdeaActions.cancelEditIdea, state => ({
    ...state,
    editing: false,
    form: initialState.form,
    ideaId: '',
  })),
  on(EditIdeaActions.updateIdea, state => ({ ...state, status: LoadStatus.Loading })),
  on(EditIdeaActions.updateIdeaDone, state => ({
    ...state,
    status: LoadStatus.Loaded,
    editing: false,
    ideaId: '',
    form: initialState.form,
  })),
  on(EditIdeaActions.updateIdeaFail, (state, { error }) => ({
    ...state,
    error,
    status: LoadStatus.Error,
  })),
  on(EditIdeaActions.ideaFormChanged, (state, { value }) => ({ ...state, form: value })),
  on(EditIdeaActions.deleteIdeaDone, state => ({
    ...state,
    editing: false,
    form: initialState.form,
    ideaId: '',
  })),
);

export function editIdeaReducer(state: IEditIdeaReducerState | undefined, action: Action) {
  return reducer(state, action);
}
