import { createSelector } from '@ngrx/store';

import { AppSelectors } from '..';
import { environment } from 'src/environments/environment';

export const selectLoading = createSelector(AppSelectors.selectUsersState, state => state.loading);
export const selectLoaded = createSelector(AppSelectors.selectUsersState, state => state.loaded);
export const selectToken = createSelector(AppSelectors.selectUsersState, state => state.token);
export const selectActivationRoute = createSelector(AppSelectors.selectUsersState, state => state.activationUrl);
export const selectFullActivationRoute = createSelector(
  selectActivationRoute,
  selectToken,
  (route, token) => `${environment.routing.auth.confirmSignUp.name}?token=${token}`,
);
