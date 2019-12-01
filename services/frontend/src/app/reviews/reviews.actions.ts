import { createAction, props } from '@ngrx/store';

import { IReviewScores, IReviewState } from '@cents-ideas/models';

const PREFIX = '[reviews]';
const FAIL = 'fail';
const DONE = 'done';

const CREATE = 'create';
export const createReview = createAction(
  `${PREFIX} ${CREATE}`,
  props<{ ideaId: string; content: string; scores: IReviewScores }>(),
);
export const createReviewDone = createAction(`${PREFIX} ${CREATE} ${DONE}`, props<{ created: IReviewState }>());
export const createReviewFail = createAction(`${PREFIX} ${CREATE} ${FAIL}`, props<{ error: string }>());

const UPDATE = 'update';
export const updateReview = createAction(
  `${PREFIX} ${UPDATE}`,
  props<{ reviewId: string; content: string; scores: IReviewScores }>(),
);
export const updateReviewDone = createAction(`${PREFIX} ${UPDATE} ${DONE}`, props<{ updated: IReviewState }>());
export const updateReviewFail = createAction(`${PREFIX} ${UPDATE} ${FAIL}`, props<{ error: string }>());

const PUBLISH = 'publish';
export const publishReview = createAction(`${PREFIX} ${PUBLISH}`, props<{ reviewId: string }>());
export const publishReviewDone = createAction(`${PREFIX} ${PUBLISH} ${DONE}`, props<{ published: IReviewState }>());
export const publishReviewFail = createAction(`${PREFIX} ${PUBLISH} ${FAIL}`, props<{ error: string }>());
