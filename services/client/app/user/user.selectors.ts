import * as __ngrxStore from '@ngrx/store/store';

import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IUserFeatureReducerState } from './user.state';
import { StoreKeys } from '@cic/shared';

const selectUserFeatureState = createFeatureSelector<any>(StoreKeys.User);
const selectUserState = createSelector(
  selectUserFeatureState,
  (state: IUserFeatureReducerState) => state.user,
);

export const UserSelectors = {
  selectUserState,
};
