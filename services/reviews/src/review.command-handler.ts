import { injectable } from 'inversify';

import { sanitizeHtml } from '@cents-ideas/utils';

import { ReviewIdeaIdRequiredError, ReviewContentLengthError, ReviewScoresRangeError } from './errors';
import { Review } from './review.entity';
import { ReviewRepository } from './review.repository';
import { IReviewScores } from '@cents-ideas/models';

export interface IIdeaCommandHandler {}

@injectable()
export class ReviewCommandHandler implements IIdeaCommandHandler {
  constructor(private repository: ReviewRepository) {}

  create = async (ideaId: string): Promise<Review> => {
    ReviewIdeaIdRequiredError.validate(ideaId);
    const reviewId = await this.repository.generateUniqueId();
    const review = Review.create(reviewId, ideaId);
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
}
