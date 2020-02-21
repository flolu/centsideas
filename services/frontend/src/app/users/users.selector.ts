import { createSelector } from '@ngrx/store';

import { AppSelectors } from '..';

export const selectLoading = createSelector(AppSelectors.selectUsersState, state => state.loading);
export const selectLoaded = createSelector(AppSelectors.selectUsersState, state => state.loaded);
export const selectUser = createSelector(AppSelectors.selectUsersState, state => state.user);
