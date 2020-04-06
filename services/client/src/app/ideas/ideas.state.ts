import { EntityState } from '@ngrx/entity';
import { IIdeaViewModel } from '@cents-ideas/models';

export interface IIdeasState extends EntityState<IIdeaViewModel> {
  loading: boolean;
  loaded: boolean;
  error: string;
}

export interface IIdeasFeatureReducerState {
  ideas: IIdeasState;
}

export const featureKey = 'ideas';
