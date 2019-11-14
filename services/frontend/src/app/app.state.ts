import { createFeatureSelector } from '@ngrx/store';

import { IdeasState } from '@ci-frontend/ideas/ideas.state';

export interface AppState {
  ideas: IdeasState;
}

const selectIdeasState = createFeatureSelector<IdeasState>('ideas');

export const AppSelectors = {
  selectIdeasState,
};
