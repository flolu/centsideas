import {DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaId, ISODate} from '@centsideas/types';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaDeletedData} from '@centsideas/models';

export class IdeaDeleted implements DomainEvent {
  readonly eventName = IdeaEventNames.Deleted;

  constructor(public readonly id: IdeaId, public readonly deletedAt: ISODate) {}

  serialize(): IdeaDeletedData {
    return {
      id: this.id.toString(),
      deletedAt: this.deletedAt.toString(),
    };
  }

  static deserialize({id, deletedAt}: IdeaDeletedData) {
    return new IdeaDeleted(IdeaId.fromString(id), ISODate.fromString(deletedAt));
  }
}
