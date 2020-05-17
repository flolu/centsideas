import {createSelector, createFeatureSelector} from '@ngrx/store';

import {IIdeaViewModel} from '@centsideas/models';

import {AuthSelectors, RouterSelectors} from '@cic/store';
import {StoreKeys} from '@cic/shared';
import {IIdeasFeatureReducerState} from './ideas.state';
import {IdeasReducerSelectors} from './ideas';

const selectIdeasFeatureState = createFeatureSelector<IIdeasFeatureReducerState>(StoreKeys.Ideas);

const ideasState = createSelector(
  selectIdeasFeatureState,
  (state: IIdeasFeatureReducerState) => state.ideas,
);

const ideas = createSelector(ideasState, IdeasReducerSelectors.selectAllIdeas);
const selectIdeaEntities = createSelector(ideasState, IdeasReducerSelectors.selectIdeaEntities);
const selectedIdeaId = RouterSelectors.param('id');
const selectedIdea = createSelector(
  selectedIdeaId,
  selectIdeaEntities,
  (id: string, entities: Record<string, IIdeaViewModel>) => {
    return entities[id];
  },
);

const editIdeaState = createSelector(
  selectIdeasFeatureState,
  (state: IIdeasFeatureReducerState) => state.edit,
);
const isCurrentUserOwner = createSelector(AuthSelectors.user, selectedIdea, (user, idea) =>
  user && idea ? user.id === idea.userId : false,
);

export const createIdeaState = createSelector(selectIdeasFeatureState, state => state.create);

export const IdeasSelectors = {
  ideasState,
  ideas,
  selectedIdea,
  selectedIdeaId,
  editIdeaState,
  isCurrentUserOwner,
  createIdeaState,
};
