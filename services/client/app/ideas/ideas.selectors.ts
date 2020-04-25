import * as __ngrxStore from '@ngrx/store/store';
import * as __entityTypes from '@ngrx/entity';

import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IIdeaViewModel } from '@centsideas/models';

import { AuthSelectors } from '@cic/store';
import { StoreKeys } from '@cic/shared';
import { IIdeasFeatureReducerState } from './ideas.state';
import * as fromIdeas from './ideas.reducer';

// TODO move the router selector to a common root store similar to @cic/store
const selectRouterState = createFeatureSelector<any>(StoreKeys.Router);
const selectIdeasFeatureState = createFeatureSelector<any>(StoreKeys.Ideas);
const selectIdeasState = createSelector(
  selectIdeasFeatureState,
  (state: IIdeasFeatureReducerState) => state.ideas,
);
const selectIdeas = createSelector(selectIdeasState, fromIdeas.selectAllIdeas);
const selectIdeaEntities = createSelector(selectIdeasState, fromIdeas.selectIdeaEntities);
const selectSelectedIdeaId = createSelector(selectRouterState, router => {
  return router ? (router.state.params.id as string) : '';
});
const selectSelectedIdea = createSelector(
  selectSelectedIdeaId,
  selectIdeaEntities,
  (id: string, entities: Record<string, IIdeaViewModel>) => {
    return entities[id];
  },
);

const selectEditIdeaState = createSelector(
  selectIdeasFeatureState,
  (state: IIdeasFeatureReducerState) => state.edit,
);
const selectIsCurrentUserOwner = createSelector(
  AuthSelectors.selectUser,
  selectSelectedIdea,
  (user, idea) => (user && idea ? user.id === idea.userId : false),
);

export const IdeasSelectors = {
  selectIdeasState,
  selectIdeas,
  selectSelectedIdea,
  selectSelectedIdeaId,
  selectEditIdeaState,
  selectIsCurrentUserOwner,
};
