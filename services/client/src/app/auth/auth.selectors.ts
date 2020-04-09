import * as __ngrxStore from '@ngrx/store/store';

import { createSelector } from '@ngrx/store';

import { IAuthFeatureReducerState } from './auth.state';
import { AppSelectors } from '../app.selectors';

const selectAuthState = createSelector(
  AppSelectors.selectAuthFeatureState,
  (state: IAuthFeatureReducerState) => state.auth,
);

export const AuthSelectors = { selectAuthState };
