import * as __ngrxStore from '@ngrx/store/store';

import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IAuthFeatureReducerState, featureKey } from './auth.state';

const selectAuthFeatureState = createFeatureSelector<IAuthFeatureReducerState>(featureKey);
const selectAuthState = createSelector(selectAuthFeatureState, state => state.auth);

export const AuthSelectors = { selectAuthState };
