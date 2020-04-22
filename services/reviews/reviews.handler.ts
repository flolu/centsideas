import { injectable } from 'inversify';

import {
  sanitizeHtml,
  NotAuthenticatedError,
  ThreadLogger,
  NoPermissionError,
} from '@centsideas/utils';
import { IReviewScores } from '@centsideas/models';

import { ReviewErrors } from './errors';
import { Review } from './review.entity';
import { ReviewRepository } from './review.repository';

@injectable()
export class ReviewsHandler {
  constructor(private repository: ReviewRepository) {}

  create = async (
    ideaId: string,
    userId: string,
    content: string,
    scores: IReviewScores,
    t: ThreadLogger,
  ): Promise<Review> => {
    NotAuthenticatedError.validate(userId);
    ReviewErrors.IdeaIdRequiredError.validate(ideaId);
    content = sanitizeHtml(content);
    ReviewErrors.SaveReviewPayloadRequiredError.validate(content, scores);
    ReviewErrors.ReviewContentLengthError.validate(content);
    ReviewErrors.ReviewScoresRangeError.validate(scores);
    t.debug('paylod is valid');

    const reviewId = await this.repository.generateUniqueId();
    const review = Review.create(reviewId, ideaId, userId, content, scores);
    t.debug(`create review with id ${reviewId}`);

    return this.repository.save(review);
  };

  update = async (
    userId: string,
    reviewId: string,
    content: string,
    scores: IReviewScores,
    t: ThreadLogger,
  ): Promise<Review> => {
    NotAuthenticatedError.validate(userId);
    ReviewErrors.ReviewIdRequiredError.validate(reviewId);
    content = sanitizeHtml(content);
    ReviewErrors.SaveReviewPayloadRequiredError.validate(content, scores);
    ReviewErrors.ReviewContentLengthError.validate(content);
    ReviewErrors.ReviewScoresRangeError.validate(scores);
    t.debug('payload is valid');

    const review = await this.repository.findById(reviewId);
    NoPermissionError.validate(userId, review.persistedState.userId);
    t.debug('user has permission');

    review.update(content, scores);
    t.debug('start updating review');
    return this.repository.save(review);
  };

  delete = async (userId: string, reviewId: string, t: ThreadLogger): Promise<Review> => {
    NotAuthenticatedError.validate(userId);
    ReviewErrors.ReviewIdRequiredError.validate(reviewId);
    t.debug('payload is valid');

    const review = await this.repository.findById(reviewId);
    NoPermissionError.validate(userId, review.persistedState.userId);
    t.debug('user has permision');

    review.delete();
    t.debug('start deleting review');
    return this.repository.save(review);
  };
}
