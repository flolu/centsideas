import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {PrivateUserEventNames} from '@centsideas/enums';
import {Timestamp} from '@centsideas/types';
import {UserModels} from '@centsideas/models';

@DomainEvent(PrivateUserEventNames.Deleted)
export class PrivateUserDeleted implements IDomainEvent {
  constructor(public readonly deletedAt: Timestamp) {}

  serialize(): UserModels.PrivateUserDeletedData {
    return {
      deletedAt: this.deletedAt.toString(),
    };
  }

  static deserialize({deletedAt}: UserModels.PrivateUserDeletedData) {
    return new PrivateUserDeleted(Timestamp.fromString(deletedAt));
  }
}
