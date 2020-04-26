import { IIdeasReducerState } from './ideas';
import { IEditIdeaReducerState } from './edit-idea';
import { ICreateIdeaReducerState } from './create-idea';

export interface IIdeasFeatureReducerState {
  ideas: IIdeasReducerState;
  create: ICreateIdeaReducerState;
  edit: IEditIdeaReducerState;
}

export interface IIdeaForm {
  title: string;
  description: string;
}
