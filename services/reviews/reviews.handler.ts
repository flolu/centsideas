import { injectable } from 'inversify';

import { sanitizeHtml, UnauthenticatedError, PermissionDeniedError } from '@centsideas/utils';
import { CreateReview, UpdateReview, DeleteReview } from '@centsideas/rpc';

import { ReviewErrors } from './errors';
import { Review } from './review.entity';
import { ReviewRepository } from './review.repository';

@injectable()
export class ReviewsHandler {
  constructor(private repository: ReviewRepository) {}

  // FIXME how to ensure that userId and ideaId are valid? (probably need to do check in gateway before sending it to here)
  create: CreateReview = async ({ ideaId, userId, scores, content }) => {
    UnauthenticatedError.validate(userId);
    ReviewErrors.IdeaIdRequiredError.validate(ideaId);
    content = sanitizeHtml(content);
    ReviewErrors.SaveReviewPayloadRequiredError.validate(content, scores);
    ReviewErrors.ReviewContentLengthError.validate(content);
    ReviewErrors.ReviewScoresRangeError.validate(scores);

    const reviewId = await this.repository.generateAggregateId();
    const review = Review.create(reviewId, ideaId, userId, content, scores);

    const created = await this.repository.save(review);
    return created.persistedState;
  };

  update: UpdateReview = async ({ reviewId, userId, scores, content }) => {
    UnauthenticatedError.validate(userId);
    ReviewErrors.ReviewIdRequiredError.validate(reviewId);
    content = sanitizeHtml(content);
    ReviewErrors.SaveReviewPayloadRequiredError.validate(content, scores);
    ReviewErrors.ReviewContentLengthError.validate(content);
    ReviewErrors.ReviewScoresRangeError.validate(scores);

    const review = await this.repository.findById(reviewId);
    PermissionDeniedError.validate(userId, review.persistedState.userId);

    review.update(content, scores);
    const updated = await this.repository.save(review);
    return updated.persistedState;
  };

  delete: DeleteReview = async ({ userId, reviewId }) => {
    UnauthenticatedError.validate(userId);
    ReviewErrors.ReviewIdRequiredError.validate(reviewId);

    const review = await this.repository.findById(reviewId);
    PermissionDeniedError.validate(userId, review.persistedState.userId);

    review.delete();
    const deleted = await this.repository.save(review);
    return deleted.persistedState;
  };
}
