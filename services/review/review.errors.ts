import {Exception} from '@centsideas/utils';
import {
  RpcStatus,
  ReviewContentLength,
  ReviewErrorNames,
  ReviewScoreValue,
} from '@centsideas/enums';
import {ReviewId, UserId, IdeaId} from '@centsideas/types';

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

export class AlreadyPublished extends Exception {
  name = ReviewErrorNames.AlreadyPublished;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(review: ReviewId) {
    super(`You have already published this review`, {reviewId: review.toString()});
  }
}

export class NotFound extends Exception {
  name = ReviewErrorNames.NotFound;
  code = RpcStatus.NOT_FOUND;

  constructor(review: ReviewId) {
    super(`Review with id ${review.toString} not found`, {reviewId: review.toString()});
  }
}

export class OneReviewPerIdea extends Exception {
  name = ReviewErrorNames.OneReviewPerIdea;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(review: ReviewId, idea: IdeaId) {
    super(`You can only write one review per idea!`, {
      reviewId: review.toString(),
      ideaId: idea.toString(),
    });
  }
}

export class IdeaNotFound extends Exception {
  name = ReviewErrorNames.IdeaNotFound;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(idea: IdeaId) {
    super(`The idea, you wanted to write a review for, was not found`, {
      ideaId: idea.toString(),
    });
  }
}

export class CantReviewOwnIdea extends Exception {
  name = ReviewErrorNames.CantReviewOwnIdea;
  code = RpcStatus.INVALID_ARGUMENT;

  constructor(idea: IdeaId, user: UserId) {
    super(`You can't review you own idea`, {
      ideaId: idea.toString(),
      userId: user.toString(),
    });
  }
}
