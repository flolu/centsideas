import { ReviewNotFoundError } from './review-not-found.error';
import { ReviewIdeaIdRequiredError } from './review-idea-id-required.error';
import { ReviewContentLengthError } from './review-content-length.error';
import { ReviewScoresRangeError } from './review-scores-range.error';
import { ReviewAlreadyPublishedError } from './review-already-published.error';
import { SaveReviewPayloadRequiredError } from './save-review-payload-required.error';
import { ReviewAlreadyUnpublishedError } from './review-already-unpublished.error';
import { AlreadyCreatedReviewError } from './already-created-review.error';

export const ReviewErrors = {
  ReviewNotFoundError,
  ReviewIdeaIdRequiredError,
  ReviewContentLengthError,
  ReviewScoresRangeError,
  ReviewAlreadyPublishedError,
  SaveReviewPayloadRequiredError,
  ReviewAlreadyUnpublishedError,
  AlreadyCreatedReviewError,
};
