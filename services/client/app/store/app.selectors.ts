import * as __ngrxStore from '@ngrx/store/store';

import { createFeatureSelector } from '@ngrx/store';

import { IRouterStateUrl } from './custom-route-serializer';

export enum FeatureKeys {
  Router = 'router',
  Ideas = 'ideas',
  Auth = 'auth',
  User = 'user',
}

const selectRouterState = createFeatureSelector<{ state: IRouterStateUrl }>(FeatureKeys.Router);
const selectAuthFeatureState = createFeatureSelector(FeatureKeys.Auth);
const selectIdeasFeatureState = createFeatureSelector(FeatureKeys.Ideas);
const selectUserFeatureState = createFeatureSelector(FeatureKeys.User);

export const AppSelectors = {
  selectRouterState,
  selectAuthFeatureState,
  selectIdeasFeatureState,
  selectUserFeatureState,
};
