import { ReviewError } from './review.error';
import { HttpStatusCodes } from '@cents-ideas/enums';
import { IReviewScores } from '@cents-ideas/models';

export class SaveReviewPayloadRequiredError extends ReviewError {
  static validate = (content: string, scores: IReviewScores): void => {
    if (!(content && scores)) {
      throw new SaveReviewPayloadRequiredError(!content, !scores);
    }
  };

  constructor(contentMissing: boolean, scoresMissing: boolean) {
    super(
      `Review content and scores are required to save an review. Missing: ${contentMissing ? 'content' : ''} ${
        scoresMissing ? ', scores' : ''
      }`,
      HttpStatusCodes.BadRequest,
    );
  }
}
