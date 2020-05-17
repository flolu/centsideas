import {createSelector, createFeatureSelector} from '@ngrx/store';

import {StoreKeys} from '@cic/shared';
import {IAuthReducerState} from './auth.state';

const state = createFeatureSelector<IAuthReducerState>(StoreKeys.Auth);
const user = createSelector(state, featureState => featureState.user);

export const AuthSelectors = {state, user};
