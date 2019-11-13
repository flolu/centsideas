import { IdeasState } from './ideas/ideas.reducer';
import { createFeatureSelector } from '@ngrx/store';

export interface AppState {
  ideas: IdeasState;
}

export const selectIdeasState = createFeatureSelector<IdeasState>('ideas');
