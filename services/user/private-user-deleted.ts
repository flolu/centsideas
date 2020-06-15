import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {PrivateUserEventNames} from '@centsideas/enums';
import {ISODate} from '@centsideas/types';
import {UserModels} from '@centsideas/models';

@DomainEvent(PrivateUserEventNames.Deleted)
export class PrivateUserDeleted implements IDomainEvent {
  constructor(public readonly deletedAt: ISODate) {}

  serialize(): UserModels.PrivateUserDeletedData {
    return {
      deletedAt: this.deletedAt.toString(),
    };
  }

  static deserialize({deletedAt}: UserModels.PrivateUserDeletedData) {
    return new PrivateUserDeleted(ISODate.fromString(deletedAt));
  }
}
