import { EntityState } from '@ngrx/entity';
import { IIdeaViewModel } from '@centsideas/models';

export interface IIdeasState extends EntityState<IIdeaViewModel> {
  loading: boolean;
  loaded: boolean;
  error: string;
}

export interface IIdeaForm {
  title: string;
  description: string;
}

export interface IIdeaEditState {
  loading: boolean;
  loaded: boolean;
  error: string;
  editing: boolean;
  form: IIdeaForm;
  ideaId: string;
}

export interface IIdeasFeatureReducerState {
  ideas: IIdeasState;
  edit: IIdeaEditState;
}
