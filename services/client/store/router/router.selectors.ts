import * as __ngrxStore from '@ngrx/store/store';

import { createFeatureSelector } from '@ngrx/store';

import { StoreKeys } from '@cic/shared';
import { IRouterState } from './router.state';

const selectRouterState = createFeatureSelector<IRouterState>(StoreKeys.Router);

export const RouterSelectors = { selectRouterState };
