import { injectable } from 'inversify';

import { sanitizeHtml, NotAuthenticatedError } from '@cents-ideas/utils';
import { IReviewScores } from '@cents-ideas/models';

import { ReviewErrors } from './errors';
import { Review } from './review.entity';
import { ReviewRepository } from './review.repository';

@injectable()
export class ReviewCommandHandler {
  constructor(private repository: ReviewRepository) {}

  create = async (ideaId: string, userId: string): Promise<Review> => {
    NotAuthenticatedError.validate(userId);
    ReviewErrors.ReviewIdeaIdRequiredError.validate(ideaId);
    const reviewId = await this.repository.generateUniqueId();
    const review = Review.create(reviewId, ideaId, userId);
    return this.repository.save(review);
  };

  saveDraft = async (
    reviewId: string,
    content?: string,
    scores?: IReviewScores,
  ): Promise<Review> => {
    ReviewErrors.ReviewIdeaIdRequiredError.validate(reviewId);
    content = sanitizeHtml(content || '');
    if (content) {
      ReviewErrors.ReviewContentLengthError.validate(content, true);
    }
    if (scores) {
      ReviewErrors.ReviewScoresRangeError.validate(scores);
    }
    const review = await this.repository.findById(reviewId);
    review.saveDraft(content, scores);
    return this.repository.save(review);
  };

  publish = async (reviewId: string): Promise<Review> => {
    ReviewErrors.ReviewIdeaIdRequiredError.validate(reviewId);
    const review = await this.repository.findById(reviewId);
    ReviewErrors.ReviewAlreadyPublishedError.validate(
      review.persistedState.published,
      review.persistedState.id,
    );
    ReviewErrors.SaveReviewPayloadRequiredError.validate(
      review.persistedState.content,
      review.persistedState.scores,
    );
    ReviewErrors.ReviewContentLengthError.validate(review.persistedState.content);
    ReviewErrors.ReviewScoresRangeError.validate(review.persistedState.scores);
    review.publish();
    return this.repository.save(review);
  };

  unpublish = async (reviewId: string): Promise<Review> => {
    ReviewErrors.ReviewIdeaIdRequiredError.validate(reviewId);
    const review = await this.repository.findById(reviewId);
    ReviewErrors.ReviewAlreadyUnpublishedError.validate(
      review.persistedState.published,
      review.persistedState.id,
    );
    review.unpublish();
    return this.repository.save(review);
  };

  update = async (reviewId: string, content: string, scores: IReviewScores): Promise<Review> => {
    ReviewErrors.ReviewIdeaIdRequiredError.validate(reviewId);
    content = sanitizeHtml(content || '');
    ReviewErrors.SaveReviewPayloadRequiredError.validate(content, scores);
    ReviewErrors.ReviewContentLengthError.validate(content);
    ReviewErrors.ReviewScoresRangeError.validate(scores);
    const review = await this.repository.findById(reviewId);
    review.update(content, scores);
    return this.repository.save(review);
  };
}
