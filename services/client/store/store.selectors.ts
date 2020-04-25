import * as __ngrxStore from '@ngrx/store/store';

import { createFeatureSelector } from '@ngrx/store';

import { IRouterState } from './store.state';
import { StoreKeys } from './store-keys.enum';

const selectRouterState = createFeatureSelector<IRouterState>(StoreKeys.Router);
// TODO import state interfaces from features
const selectAuthFeatureState = createFeatureSelector(StoreKeys.Auth);
const selectIdeasFeatureState = createFeatureSelector(StoreKeys.Ideas);
const selectUserFeatureState = createFeatureSelector(StoreKeys.User);

export const AppSelectors = {
  selectRouterState,
  selectAuthFeatureState,
  selectIdeasFeatureState,
  selectUserFeatureState,
};
