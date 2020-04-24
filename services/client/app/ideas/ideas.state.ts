import { EntityState } from '@ngrx/entity';

import { IIdeaViewModel } from '@centsideas/models';
import { LoadStatus } from '@cic/helpers';

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
