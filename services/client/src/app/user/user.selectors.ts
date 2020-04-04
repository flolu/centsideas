import * as __ngrxStore from '@ngrx/store/store';

import { createSelector, createFeatureSelector } from '@ngrx/store';

const selectUserFeatureState = createFeatureSelector<any>('users');

const selectUserState = createSelector(selectUserFeatureState, state => state.user);
const selectAuthState = createSelector(selectUserFeatureState, state => state.auth);
const selectUser = createSelector(selectUserState, state => state.user);

export const UserSelectors = {
  selectUserFeatureState,
  selectUserState,
  selectAuthState,
  selectUser,
};
