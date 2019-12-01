import { createReducer, on, Action } from '@ngrx/store';

import { ReviewsState } from './reviews.state';
import { ReviewsActions } from '.';

const initialState: ReviewsState = {
  loading: false,
  loaded: false,
  error: '',
};

const reviewsReducer = createReducer(
  initialState,
  on(ReviewsActions.createReview, state => ({ ...state, loading: true, loaded: false, error: null })),
  on(ReviewsActions.createReviewFail, (state, action) => ({
    ...state,
    loading: false,
    loaded: false,
    error: action.error,
  })),
  on(ReviewsActions.updateReviewFail, (state, action) => ({
    ...state,
    loading: false,
    loaded: false,
    error: action.error,
  })),
  on(ReviewsActions.publishReviewDone, (state, action) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(ReviewsActions.publishReviewFail, (state, action) => ({
    ...state,
    loading: false,
    loaded: false,
    error: action.error,
  })),
);

export function reducer(state: ReviewsState | undefined, action: Action) {
  return reviewsReducer(state, action);
}
