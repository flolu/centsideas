import * as __ngrxStore from '@ngrx/store/store';
import * as __entityTypes from '@ngrx/entity';

import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IIdeaViewModel } from '@centsideas/models';

import { AuthSelectors, RouterSelectors } from '@cic/store';
import { StoreKeys } from '@cic/shared';
import { IIdeasFeatureReducerState } from './ideas.state';
import { IdeasReducerSelectors } from './ideas';

const selectIdeasFeatureState = createFeatureSelector<IIdeasFeatureReducerState>(StoreKeys.Ideas);

const selectIdeasState = createSelector(
  selectIdeasFeatureState,
  (state: IIdeasFeatureReducerState) => state.ideas,
);

const selectIdeas = createSelector(selectIdeasState, IdeasReducerSelectors.selectAllIdeas);
const selectIdeaEntities = createSelector(
  selectIdeasState,
  IdeasReducerSelectors.selectIdeaEntities,
);
// TODO create router util
const selectSelectedIdeaId = createSelector(RouterSelectors.selectRouterState, router => {
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
