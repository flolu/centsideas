import * as __ngrxStore from '@ngrx/store/store';

import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IUserFeatureReducerState, featureKey } from './user.state';

const selectUserFeatureState = createFeatureSelector<IUserFeatureReducerState>(featureKey);
const selectUserState = createSelector(selectUserFeatureState, state => state.user);
const selectUser = createSelector(selectUserState, state => state.user);

export const UserSelectors = {
  selectUserFeatureState,
  selectUserState,
  selectUser,
};
