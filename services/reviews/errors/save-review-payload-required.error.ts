import { EntityError } from '@centsideas/utils';
import { HttpStatusCodes } from '@centsideas/enums';
import { IReviewScores } from '@centsideas/models';

export class SaveReviewPayloadRequiredError extends EntityError {
  static validate = (content: string, scores: IReviewScores): void => {
    if (!(content && scores)) {
      throw new SaveReviewPayloadRequiredError(!content, !scores);
    }
  };

  constructor(contentMissing: boolean, scoresMissing: boolean) {
    super(
      `Review content and scores are required to save an review. Missing: ${
        contentMissing ? 'content' : ''
      } ${scoresMissing ? ', scores' : ''}`,
      HttpStatusCodes.BadRequest,
    );
  }
}
