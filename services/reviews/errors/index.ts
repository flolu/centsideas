import {ReviewNotFoundError} from './review-not-found.error';
import {IdeaIdRequiredError} from './idea-id-required.error';
import {ReviewContentLengthError} from './review-content-length.error';
import {ReviewScoresRangeError} from './review-scores-range.error';
import {SaveReviewPayloadRequiredError} from './save-review-payload-required.error';
import {AlreadyCreatedReviewError} from './already-created-review.error';
import {ReviewIdRequiredError} from './review-id-required.error';

export const ReviewErrors = {
  ReviewNotFoundError,
  IdeaIdRequiredError,
  ReviewContentLengthError,
  ReviewScoresRangeError,
  SaveReviewPayloadRequiredError,
  AlreadyCreatedReviewError,
  ReviewIdRequiredError,
};
