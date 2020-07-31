import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {ReviewEventNames} from '@centsideas/enums';
import {ReviewModels} from '@centsideas/models';

import {ReviewScore} from './review-score';

@DomainEvent(ReviewEventNames.ScoreChanged)
export class ReviewScoreChanged implements IDomainEvent {
  constructor(public readonly score: ReviewScore) {}

  serialize(): ReviewModels.ScoreChangedData {
    return {score: this.score.toObject()};
  }

  static deserialize({score}: ReviewModels.ScoreChangedData) {
    return new ReviewScoreChanged(ReviewScore.fromObject(score));
  }
}
