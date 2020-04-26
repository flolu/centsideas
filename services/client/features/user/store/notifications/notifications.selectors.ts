import * as __ngrxStore from '@ngrx/store/store';

import { createSelector } from '@ngrx/store';

import { selectUserFeatureState } from '../user.selectors';

const selectNotificationsState = createSelector(
  selectUserFeatureState,
  state => state.notifications,
);

// TODO remove "select" from all those names?
export const NotificationsSelectors = { selectNotificationsState };
