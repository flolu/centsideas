import {RpcStatus, ErrorNames} from '@centsideas/enums';
import {InternalError} from '@centsideas/utils';
import {IReviewScores} from '@centsideas/models';

export class ReviewScoresRangeError extends InternalError {
  static min: number = 0;
  static max: number = 5;

  static validate = (scores: IReviewScores): void => {
    Object.keys(scores).forEach(name => {
      const score: number = (scores as any)[name] as number;
      if (score > ReviewScoresRangeError.max) throw new ReviewScoresRangeError(name, true, score);
      if (score < ReviewScoresRangeError.min) throw new ReviewScoresRangeError(name, false, score);
    });
  };

  constructor(invalidScoreName: string, isToBig: boolean, actualValue: number) {
    const message = isToBig
      ? `Score can't be bigger than ${ReviewScoresRangeError.max}.`
      : `Score shouldn't be smaller than ${ReviewScoresRangeError.min}.`;
    super(`${message} You've set ${invalidScoreName} to ${actualValue}`, {
      name: ErrorNames.ReviewScoresRange,
      code: RpcStatus.INVALID_ARGUMENT,
    });
  }
}
