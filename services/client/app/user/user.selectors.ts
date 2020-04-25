import * as __ngrxStore from '@ngrx/store/store';

import { createSelector } from '@ngrx/store';

import { AppSelectors } from '@cic/store';
import { IUserFeatureReducerState } from './user.state';

const selectUserState = createSelector(
  AppSelectors.selectUserFeatureState,
  (state: IUserFeatureReducerState) => state.user,
);

export const UserSelectors = {
  selectUserState,
};
