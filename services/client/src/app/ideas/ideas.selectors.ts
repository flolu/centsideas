import * as __ngrxStore from '@ngrx/store/store';
import * as __entityTypes from '@ngrx/entity';

import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IIdeasFeatureReducerState, featureKey } from './ideas.state';
import * as fromIdeas from './ideas.reducer';

const selectIdeasFeatureState = createFeatureSelector<IIdeasFeatureReducerState>(featureKey);
const selectIdeasState = createSelector(selectIdeasFeatureState, state => state.ideas);
export const selectIdeas = createSelector(selectIdeasState, fromIdeas.selectAllIdeas);
export const selectIdeaEntities = createSelector(selectIdeasState, fromIdeas.selectIdeaEntities);
export const selectIdea = (id: string) =>
  createSelector(selectIdeaEntities, entities => entities[id]);

export const IdeasSelectors = { selectIdeasState, selectIdea, selectIdeas };
