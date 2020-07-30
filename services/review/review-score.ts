import {ReviewScoreValue} from '@centsideas/enums';
import {ReviewModels} from '@centsideas/models';

import * as Errors from './review.errors';

export class ReviewScore {
  private constructor(private score: ReviewModels.SerializedReviewScore) {
    const keys: (keyof ReviewModels.SerializedReviewScore)[] = [
      'control',
      'entry',
      'need',
      'time',
      'scale',
    ];
    for (const key of keys) {
      this.checkScoreValue(score[key], key);
    }
  }

  private checkScoreValue(value: number, key: string) {
    if (isNaN(value) || value > ReviewScoreValue.Max || value < ReviewScoreValue.Min)
      throw new Errors.ReviewScoreInvalid(value, key);
  }

  static fromObject(score: ReviewModels.SerializedReviewScore) {
    return new ReviewScore(score);
  }

  toObject() {
    return this.score;
  }

  equals(other: ReviewScore) {
    const otherObj = other.toObject();
    const thisObj = this.toObject();
    return (
      otherObj.control === thisObj.control &&
      otherObj.entry === thisObj.entry &&
      otherObj.need === thisObj.need &&
      otherObj.time === thisObj.time &&
      otherObj.scale === thisObj.scale
    );
  }
}
