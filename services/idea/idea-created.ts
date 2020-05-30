import {IDomainEvent, DomainEvent} from '@centsideas/event-sourcing';
import {IdeaId, UserId, ISODate} from '@centsideas/types';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaModels} from '@centsideas/models';

@DomainEvent(IdeaEventNames.Created)
export class IdeaCreated implements IDomainEvent {
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
