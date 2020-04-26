import * as __ngrxStore from '@ngrx/store/store';

import { createFeatureSelector } from '@ngrx/store';

import { StoreKeys } from '@cic/shared';
import { IUserFeatureReducerState } from './user.state';

export const selectUserFeatureState = createFeatureSelector<IUserFeatureReducerState>(
  StoreKeys.User,
);
