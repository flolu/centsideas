import * as __ngrxStore from '@ngrx/store/store';

import { createSelector } from '@ngrx/store';

import { selectUserFeatureState } from '../user.selectors';

const selectMeState = createSelector(selectUserFeatureState, state => state.me);

export const MeSelectors = {
  selectMeState,
};
