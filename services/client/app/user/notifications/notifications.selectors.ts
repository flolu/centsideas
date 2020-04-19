import * as __ngrxStore from '@ngrx/store/store';

import { createSelector } from '@ngrx/store';

import { IUserFeatureReducerState } from '../user.state';
import { AppSelectors } from '../../store/app.selectors';

const selectNotificationsState = createSelector(
  AppSelectors.selectUserFeatureState,
  (state: IUserFeatureReducerState) => state.notifications,
);
export const NotificationsSelectors = { selectNotificationsState };
