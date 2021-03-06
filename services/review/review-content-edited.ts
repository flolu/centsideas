import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {ReviewEventNames} from '@centsideas/enums';
import {ReviewModels} from '@centsideas/models';

import {ReviewContent} from './review-content';

@DomainEvent(ReviewEventNames.ContentEdited)
export class ReviewContentEdited implements IDomainEvent {
  constructor(public readonly content: ReviewContent) {}

  serialize(): ReviewModels.ContentEditedData {
    return {content: this.content.toString()};
  }

  static deserialize({content}: ReviewModels.ContentEditedData) {
    return new ReviewContentEdited(ReviewContent.fromString(content));
  }
}
