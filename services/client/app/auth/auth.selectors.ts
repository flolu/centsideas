import * as __ngrxStore from '@ngrx/store/store';

import { createSelector } from '@ngrx/store';

import { AppSelectors } from '@cic/store';
import { IAuthFeatureReducerState } from './auth.state';

const selectAuthState = createSelector(
  AppSelectors.selectAuthFeatureState,
  (state: IAuthFeatureReducerState) => state.auth,
);

const selectUser = createSelector(selectAuthState, state => state.persistedUser);

export const AuthSelectors = { selectAuthState, selectUser };
