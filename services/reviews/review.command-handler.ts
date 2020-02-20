import { injectable } from 'inversify';

import { sanitizeHtml, NotAuthenticatedError } from '@cents-ideas/utils';

import {
  ReviewIdeaIdRequiredError,
  ReviewContentLengthError,
  ReviewScoresRangeError,
  ReviewAlreadyPublishedError,
  SaveReviewPayloadRequiredError,
  AlreadyCreatedReviewError,
} from './errors';
import { Review } from './review.entity';
import { ReviewRepository } from './review.repository';
import { IReviewScores } from '@cents-ideas/models';
import { ReviewAlreadyUnpublishedError } from './errors/review-already-unpublished.error';

@injectable()
export class ReviewCommandHandler {
  constructor(private repository: ReviewRepository) {}

  create = async (ideaId: string, userId: string): Promise<Review> => {
    NotAuthenticatedError.validate(userId);
    ReviewIdeaIdRequiredError.validate(ideaId);
    const reviewId = await this.repository.generateUniqueId();
    const review = Review.create(reviewId, ideaId, userId);
    return this.repository.save(review);
  };

  saveDraft = async (reviewId: string, content?: string, scores?: IReviewScores): Promise<Review> => {
    ReviewIdeaIdRequiredError.validate(reviewId);
    content = sanitizeHtml(content || '');
    if (content) {
      ReviewContentLengthError.validate(content, true);
    }
    if (scores) {
      ReviewScoresRangeError.validate(scores);
    }
    const review = await this.repository.findById(reviewId);
    review.saveDraft(content, scores);
    return this.repository.save(review);
  };

  publish = async (reviewId: string): Promise<Review> => {
    ReviewIdeaIdRequiredError.validate(reviewId);
    const review = await this.repository.findById(reviewId);
    ReviewAlreadyPublishedError.validate(review.persistedState.published, review.persistedState.id);
    SaveReviewPayloadRequiredError.validate(review.persistedState.content, review.persistedState.scores);
    ReviewContentLengthError.validate(review.persistedState.content);
    ReviewScoresRangeError.validate(review.persistedState.scores);
    review.publish();
    return this.repository.save(review);
  };

  unpublish = async (reviewId: string): Promise<Review> => {
    ReviewIdeaIdRequiredError.validate(reviewId);
    const review = await this.repository.findById(reviewId);
    ReviewAlreadyUnpublishedError.validate(review.persistedState.published, review.persistedState.id);
    review.unpublish();
    return this.repository.save(review);
  };

  update = async (reviewId: string, content: string, scores: IReviewScores): Promise<Review> => {
    ReviewIdeaIdRequiredError.validate(reviewId);
    content = sanitizeHtml(content || '');
    SaveReviewPayloadRequiredError.validate(content, scores);
    ReviewContentLengthError.validate(content);
    ReviewScoresRangeError.validate(scores);
    const review = await this.repository.findById(reviewId);
    review.update(content, scores);
    return this.repository.save(review);
  };
}
