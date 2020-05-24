import {DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaId, UserId, ISODate} from '@centsideas/types';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaModels} from '@centsideas/models';

export class IdeaCreated implements DomainEvent {
  readonly eventName = IdeaEventNames.Created;

  constructor(
    public readonly id: IdeaId,
    public readonly userId: UserId,
    public readonly createdAt: ISODate,
  ) {}

  serialize(): IdeaModels.IdeaCreatedData {
    return {
      id: this.id.toString(),
      userId: this.userId.toString(),
      createdAt: this.createdAt.toString(),
    };
  }

  static deserialize({id, userId, createdAt}: IdeaModels.IdeaCreatedData) {
    return new IdeaCreated(
      IdeaId.fromString(id),
      UserId.fromString(userId),
      ISODate.fromString(createdAt),
    );
  }
}
