import { createFeatureSelector } from '@ngrx/store';

import { IdeasState } from '@ci-frontend/ideas/ideas.state';
import { ReviewsState } from '@ci-frontend/reviews/reviews.state';
import { IUsersState } from '@ci-frontend/users/users.state';

export interface AppState {
  ideas: IdeasState;
  reviews: ReviewsState;
  users: IUsersState;
}

const selectIdeasState = createFeatureSelector<IdeasState>('ideas');
const selectReviewsState = createFeatureSelector<ReviewsState>('reviews');
const selectUsersState = createFeatureSelector<IUsersState>('users');

export const AppSelectors = {
  selectIdeasState,
  selectReviewsState,
  selectUsersState,
};
