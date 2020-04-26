import * as __ngrxStore from '@ngrx/store/store';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StoreKeys } from '@cic/shared';
import { IRouterState } from './router.state';

const selectRouterState = createFeatureSelector<IRouterState>(StoreKeys.Router);
const selectQueryParam = (param: string) =>
  createSelector(selectRouterState, router => router.state.queryParams[param]);

export const RouterSelectors = { selectRouterState, selectQueryParam };
