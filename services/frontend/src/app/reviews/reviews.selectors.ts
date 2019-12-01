import { createSelector } from '@ngrx/store';
import { AppSelectors } from '..';

export const selectLoading = createSelector(AppSelectors.selectReviewsState, state => state.loading);
