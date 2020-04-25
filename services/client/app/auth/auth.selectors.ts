import * as __ngrxStore from '@ngrx/store/store';

import { createSelector } from '@ngrx/store';

import { IAuthFeatureReducerState } from './auth.state';
import { AppSelectors } from '../store/app.selectors';

const selectAuthState = createSelector(
  AppSelectors.selectAuthFeatureState,
  (state: IAuthFeatureReducerState) => state.auth,
);

const selectUser = createSelector(selectAuthState, state => state.persistedUser);

export const AuthSelectors = { selectAuthState, selectUser };
