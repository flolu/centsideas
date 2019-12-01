import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { ReviewsService } from './reviews.service';
import { ReviewsActions } from '.';

@Injectable()
export class ReviewsEffects {
  constructor(private actions$: Actions, private reviewsServices: ReviewsService) {}

  createReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.createReview),
      switchMap(({ ideaId, content, scores }) =>
        this.reviewsServices.createReview(ideaId).pipe(
          switchMap(created => [
            ReviewsActions.createReviewDone({ created }),
            ReviewsActions.updateReview({ reviewId: created.id, content, scores }),
          ]),
          catchError(error => of(ReviewsActions.createReviewFail({ error }))),
        ),
      ),
    ),
  );

  updateReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.updateReview),
      switchMap(({ reviewId, content, scores }) =>
        this.reviewsServices.updateReview(reviewId, content, scores).pipe(
          switchMap(updated => [
            ReviewsActions.updateReviewDone({ updated }),
            ReviewsActions.publishReview({ reviewId: updated.id }),
          ]),
          catchError(error => of(ReviewsActions.updateReviewFail({ error }))),
        ),
      ),
    ),
  );

  publishReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.publishReview),
      switchMap(({ reviewId }) =>
        this.reviewsServices.publishReview(reviewId).pipe(
          map(published => ReviewsActions.publishReviewDone({ published })),
          catchError(error => of(ReviewsActions.publishReviewFail({ error }))),
        ),
      ),
    ),
  );
}
