import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {ReviewId, UserId, IdeaId, Timestamp} from '@centsideas/types';
import {ReviewModels} from '@centsideas/models';
import {ReviewEventNames} from '@centsideas/enums';

@DomainEvent(ReviewEventNames.Created)
export class ReviewCreated implements IDomainEvent {
  constructor(
    public readonly id: ReviewId,
    public readonly author: UserId,
    public readonly receiver: UserId,
    public readonly idea: IdeaId,
    public readonly createdAt: Timestamp,
  ) {}

  serialize(): ReviewModels.CreatedData {
    return {
      id: this.id.toString(),
      authorUserId: this.author.toString(),
      receiverUserId: this.receiver.toString(),
      ideaId: this.idea.toString(),
      createdAt: this.createdAt.toString(),
    };
  }

  static deserialize({
    id,
    authorUserId,
    receiverUserId,
    ideaId,
    createdAt,
  }: ReviewModels.CreatedData) {
    return new ReviewCreated(
      ReviewId.fromString(id),
      UserId.fromString(authorUserId),
      UserId.fromString(receiverUserId),
      IdeaId.fromString(ideaId),
      Timestamp.fromString(createdAt),
    );
  }
}
