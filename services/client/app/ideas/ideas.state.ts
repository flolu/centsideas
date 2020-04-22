import { EntityState } from '@ngrx/entity';

import { IIdeaViewModel } from '@centsideas/models';

import { LoadStatus } from '../../shared/helpers/state.helper';

export interface IIdeasState extends EntityState<IIdeaViewModel> {
  status: LoadStatus;
  error: string;
}

export interface IIdeaForm {
  title: string;
  description: string;
}

export interface IIdeaEditState {
  error: string;
  editing: boolean;
  form: IIdeaForm;
  ideaId: string;
  status: LoadStatus;
}

export interface IIdeasFeatureReducerState {
  ideas: IIdeasState;
  edit: IIdeaEditState;
}
