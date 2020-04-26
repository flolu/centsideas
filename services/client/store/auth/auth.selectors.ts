import * as __ngrxStore from '@ngrx/store/store';

import { createSelector, createFeatureSelector } from '@ngrx/store';

import { StoreKeys } from '@cic/shared';
import { IAuthReducerState } from './auth.state';

const selectAuthState = createFeatureSelector<IAuthReducerState>(StoreKeys.Auth);
const selectUser = createSelector(selectAuthState, state => state.user);

export const AuthSelectors = { selectAuthState, selectUser };
