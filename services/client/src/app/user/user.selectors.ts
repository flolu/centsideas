import * as __ngrxStore from '@ngrx/store/store';

import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IUserFeatureReducerState } from './user.state';
import { featureKey } from './user.state';

const selectUserFeatureState = createFeatureSelector<IUserFeatureReducerState>(featureKey);

const selectUserState = createSelector(selectUserFeatureState, state => state.user);
const selectAuthState = createSelector(selectUserFeatureState, state => state.auth);
const selectUser = createSelector(selectUserState, state => state.user);

export const UserSelectors = {
  selectUserFeatureState,
  selectUserState,
  selectAuthState,
  selectUser,
};
