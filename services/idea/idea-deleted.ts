import {DomainEvent} from '@centsideas/event-sourcing2';
import {IdeaId} from '@centsideas/types';

interface IdeaDeletedData {
  id: string;
}

export class IdeaDeleted implements DomainEvent {
  static readonly eventName = 'idea.deleted';

  constructor(public readonly id: IdeaId) {}

  serialize(): IdeaDeletedData {
    return {
      id: this.id.toString(),
    };
  }

  static deserialize({id}: IdeaDeletedData) {
    return new IdeaDeleted(IdeaId.fromString(id));
  }
}
