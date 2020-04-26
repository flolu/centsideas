import * as __ngrxStore from '@ngrx/store/store';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StoreKeys } from '@cic/shared';
import { IRouterState } from './router.state';

const state = createFeatureSelector<IRouterState>(StoreKeys.Router);
const routerState = createSelector(state, router => router && router.state);

const queryParam = (key: string) => createSelector(routerState, router => router?.queryParams[key]);
const param = (key: string) => createSelector(routerState, router => router?.params[key]);

export const RouterSelectors = { state, queryParam, param };
