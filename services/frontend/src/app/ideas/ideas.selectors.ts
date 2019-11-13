import { createSelector } from '@ngrx/store';

import { selectIdeasState } from '../app.state';
import * as fromIdeas from './ideas.reducer';

export const selectIdeas = createSelector(selectIdeasState, fromIdeas.selectAllIdeas);
export const selectLoading = createSelector(selectIdeasState, state => state.loading);
