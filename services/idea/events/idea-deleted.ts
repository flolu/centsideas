import {IDomainEvent, DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaId, ISODate} from '@centsideas/types';
import {IdeaEventNames} from '@centsideas/enums';
import {IdeaModels} from '@centsideas/models';

@DomainEvent(IdeaEventNames.Deleted)
export class IdeaDeleted implements IDomainEvent {
  constructor(public readonly id: IdeaId, public readonly deletedAt: ISODate) {}

  serialize(): IdeaModels.IdeaDeletedData {
    return {
      id: this.id.toString(),
      deletedAt: this.deletedAt.toString(),
    };
  }

  static deserialize({id, deletedAt}: IdeaModels.IdeaDeletedData) {
    return new IdeaDeleted(IdeaId.fromString(id), ISODate.fromString(deletedAt));
  }
}
