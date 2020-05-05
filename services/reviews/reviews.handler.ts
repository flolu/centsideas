import { injectable } from 'inversify';

import { sanitizeHtml, UnauthenticatedError, PermissionDeniedError } from '@centsideas/utils';
import { IReviewScores } from '@centsideas/models';

import { ReviewErrors } from './errors';
import { Review } from './review.entity';
import { ReviewRepository } from './review.repository';

@injectable()
export class ReviewsHandler {
  constructor(private repository: ReviewRepository) {}

  // FIXME how to ensure that userId and ideaId are valid? (probably need to do check in gateway before sending it to here)
  create = async (
    ideaId: string,
    userId: string,
    content: string,
    scores: IReviewScores,
  ): Promise<Review> => {
    UnauthenticatedError.validate(userId);
    ReviewErrors.IdeaIdRequiredError.validate(ideaId);
    content = sanitizeHtml(content);
    ReviewErrors.SaveReviewPayloadRequiredError.validate(content, scores);
    ReviewErrors.ReviewContentLengthError.validate(content);
    ReviewErrors.ReviewScoresRangeError.validate(scores);

    const reviewId = await this.repository.generateAggregateId();
    const review = Review.create(reviewId, ideaId, userId, content, scores);

    return this.repository.save(review);
  };

  update = async (
    userId: string,
    reviewId: string,
    content: string,
    scores: IReviewScores,
  ): Promise<Review> => {
    UnauthenticatedError.validate(userId);
    ReviewErrors.ReviewIdRequiredError.validate(reviewId);
    content = sanitizeHtml(content);
    ReviewErrors.SaveReviewPayloadRequiredError.validate(content, scores);
    ReviewErrors.ReviewContentLengthError.validate(content);
    ReviewErrors.ReviewScoresRangeError.validate(scores);

    const review = await this.repository.findById(reviewId);
    PermissionDeniedError.validate(userId, review.persistedState.userId);

    review.update(content, scores);
    return this.repository.save(review);
  };

  delete = async (userId: string, reviewId: string): Promise<Review> => {
    UnauthenticatedError.validate(userId);
    ReviewErrors.ReviewIdRequiredError.validate(reviewId);

    const review = await this.repository.findById(reviewId);
    PermissionDeniedError.validate(userId, review.persistedState.userId);

    review.delete();
    return this.repository.save(review);
  };
}
