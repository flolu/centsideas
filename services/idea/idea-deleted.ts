import {IDomainEvent, DomainEvent} from '@centsideas/event-sourcing';
import {Timestamp} from '@centsideas/types';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaModels} from '@centsideas/models';

@DomainEvent(IdeaEventNames.Deleted)
export class IdeaDeleted implements IDomainEvent {
  constructor(public readonly deletedAt: Timestamp) {}

  serialize(): IdeaModels.IdeaDeletedData {
    return {
      deletedAt: this.deletedAt.toString(),
    };
  }

  static deserialize({deletedAt}: IdeaModels.IdeaDeletedData) {
    return new IdeaDeleted(Timestamp.fromString(deletedAt));
  }
}
