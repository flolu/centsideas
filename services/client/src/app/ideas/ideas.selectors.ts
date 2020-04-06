import * as __ngrxStore from '@ngrx/store/store';

import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IIdeasFeatureReducerState, featureKey } from './ideas.state';

const selectIdeasFeatureState = createFeatureSelector<IIdeasFeatureReducerState>(featureKey);
const selectIdeasState = createSelector(selectIdeasFeatureState, state => state.ideas);
// TODO implement
const selectIdeas = createSelector(selectIdeasFeatureState, state => []);

export const IdeasSelectors = { selectIdeasState, selectIdeas };
