import { createSelector } from '@ngrx/store';

import { AppSelectors } from '@ci-frontend/app';
import * as ideas from './ideas.reducer';

export const selectIdeas = createSelector(AppSelectors.selectIdeasState, ideas.selectAllIdeas);
export const selectLoading = createSelector(AppSelectors.selectIdeasState, state => state.loading);
export const selectIdeaEntities = createSelector(
  AppSelectors.selectIdeasState,
  ideas.selectIdeaEntities,
);
export const selectIdea = (id: string) =>
  createSelector(selectIdeaEntities, entities => entities[id]);
