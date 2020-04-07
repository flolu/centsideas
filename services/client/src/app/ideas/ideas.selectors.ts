import * as __ngrxStore from '@ngrx/store/store';
import * as __entityTypes from '@ngrx/entity';

import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IIdeasFeatureReducerState, featureKey } from './ideas.state';
import * as fromIdeas from './ideas.reducer';
import { IIdeaViewModel } from '@cents-ideas/models';

const selectIdeasFeatureState = createFeatureSelector<IIdeasFeatureReducerState>(featureKey);
const selectIdeasState = createSelector(selectIdeasFeatureState, state => state.ideas);
const selectIdeas = createSelector(selectIdeasState, fromIdeas.selectAllIdeas);
const selectIdeaEntities = createSelector(selectIdeasState, fromIdeas.selectIdeaEntities);
const selectSelectedIdeaId = createSelector(
  // TODO split router store from app module to make it importable as clean selector (selectors, types, ...)
  createFeatureSelector('router'),
  (router: any) => router.state.params.id as string,
);
const selectSelectedIdea = createSelector(
  selectSelectedIdeaId,
  selectIdeaEntities,
  (id: string, entities: Record<string, IIdeaViewModel>) => {
    return entities[id];
  },
);

export const IdeasSelectors = {
  selectIdeasState,
  selectIdeas,
  selectSelectedIdea,
  selectSelectedIdeaId,
};