import { RpcStatus, ErrorNames } from '@centsideas/enums';
import { InternalError } from '@centsideas/utils';
import { IReviewScores } from '@centsideas/models';

export class SaveReviewPayloadRequiredError extends InternalError {
  static validate = (content: string, scores: IReviewScores): void => {
    if (!(content && scores)) throw new SaveReviewPayloadRequiredError(!content, !scores);
  };

  constructor(contentMissing: boolean, scoresMissing: boolean) {
    super(
      `Review content and scores are required to save an review. Missing: ${
        contentMissing ? 'content' : ''
      } ${scoresMissing ? ', scores' : ''}`,
      {
        name: ErrorNames.SaveReviewPayloadRequired,
        code: RpcStatus.INVALID_ARGUMENT,
      },
    );
  }
}
