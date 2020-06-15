import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {UserEventNames} from '@centsideas/enums';
import {UserModels} from '@centsideas/models';
import {Timestamp} from '@centsideas/types';

@DomainEvent(UserEventNames.DeletionConfirmed)
export class UserDeletionConfirmed implements IDomainEvent {
  constructor(public readonly deletedAt: Timestamp) {}

  serialize(): UserModels.DeletionConfirmedData {
    return {deletedAt: this.deletedAt.toString()};
  }

  static deserialize({deletedAt}: UserModels.DeletionConfirmedData) {
    return new UserDeletionConfirmed(Timestamp.fromString(deletedAt));
  }
}
