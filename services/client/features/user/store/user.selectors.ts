import {createFeatureSelector, createSelector} from '@ngrx/store';

import {StoreKeys} from '@cic/shared';
import {IUserFeatureReducerState} from './user.state';

const selectUserFeatureState = createFeatureSelector<IUserFeatureReducerState>(StoreKeys.User);

const notificationsState = createSelector(selectUserFeatureState, state => state.notifications);
const meState = createSelector(selectUserFeatureState, state => state.me);

export const UserSelectors = {
  notificationsState,
  meState,
};
