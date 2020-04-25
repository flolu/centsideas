import * as __ngrxStore from '@ngrx/store/store';

import { createSelector, createFeatureSelector } from '@ngrx/store';

import { StoreKeys } from '@cic/shared';
import { IUserFeatureReducerState } from '../user.state';

// TODO reuse this selector from user.seldctors if possible
const selectUserFeatureState = createFeatureSelector<any>(StoreKeys.User);
const selectNotificationsState = createSelector(
  selectUserFeatureState,
  (state: IUserFeatureReducerState) => state.notifications,
);
export const NotificationsSelectors = { selectNotificationsState };
