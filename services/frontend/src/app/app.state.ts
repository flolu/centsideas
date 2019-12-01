import { createFeatureSelector } from '@ngrx/store';

import { IdeasState } from '@ci-frontend/ideas/ideas.state';
import { ReviewsState } from './reviews/reviews.state';

export interface AppState {
  ideas: IdeasState;
  reviews: ReviewsState;
}

const selectIdeasState = createFeatureSelector<IdeasState>('ideas');
const selectReviewsState = createFeatureSelector<IdeasState>('reviews');

export const AppSelectors = {
  selectIdeasState,
  selectReviewsState,
};
