import * as __ngrxStore from '@ngrx/store/store';

import { createSelector } from '@ngrx/store';

import { IUserFeatureReducerState } from './user.state';
import { AppSelectors } from '../store/app.selectors';

const selectUserState = createSelector(
  AppSelectors.selectUserFeatureState,
  (state: IUserFeatureReducerState) => state.user,
);
const selectUser = createSelector(selectUserState, state => state.user);

export const UserSelectors = {
  selectUserState,
  selectUser,
};
