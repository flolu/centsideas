import {Exception} from '@centsideas/utils';
import {
  RpcStatus,
  ReviewContentLength,
  ReviewErrorNames,
  ReviewScoreValue,
} from '@centsideas/enums';
import {ReviewId, UserId} from '@centsideas/types';

export class ReviewTooLong extends Exception {
  name = ReviewErrorNames.TooLong;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(content: string) {
    super(`Review too short. Max length is ${ReviewContentLength.Max}.`, {
      content: content.toString(),
    });
  }
}

export class ReviewTooShort extends Exception {
  name = ReviewErrorNames.TooShort;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(content: string) {
    super(`Review too short. Min length is ${ReviewContentLength.Min}.`, {
      content: content.toString(),
    });
  }
}

export class ReviewScoreInvalid extends Exception {
  name = ReviewErrorNames.TooShort;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(value: number, key: string) {
    super(
      `Review score invalid. Value for ${key} should be a number between ${ReviewScoreValue.Min} and ${ReviewScoreValue.Max}`,
      {value, key},
    );
  }
}

export class NoPermissionToAccessReview extends Exception {
  name = ReviewErrorNames.NoPermission;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(idea: ReviewId, user: UserId) {
    super(`No permission to access review with id: ${idea.toString()}`, {
      ideaId: idea.toString(),
      userId: user.toString(),
    });
  }
}

export class ReviewScoreRequired extends Exception {
  name = ReviewErrorNames.ScoreRequired;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(review: ReviewId) {
    super(`Review score is required before publishing!`, {reviewId: review.toString()});
  }
}

export class ReviewContentRequired extends Exception {
  name = ReviewErrorNames.ContentRequired;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(review: ReviewId) {
    super(`Review content is required before publishing!`, {reviewId: review.toString()});
  }
}
