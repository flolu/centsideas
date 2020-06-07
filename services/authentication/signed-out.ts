import {IDomainEvent, DomainEvent} from '@centsideas/event-sourcing';
import {AuthenticationEventNames} from '@centsideas/enums';
import {ISODate} from '@centsideas/types';
import {SessionModels} from '@centsideas/models';

@DomainEvent(AuthenticationEventNames.SignedOut)
export class SignedOut implements IDomainEvent {
  constructor(public readonly signedOutAt: ISODate) {}

  serialize(): SessionModels.SignedOutData {
    return {
      signedOutAt: this.signedOutAt.toString(),
    };
  }

  static deserialize({signedOutAt}: SessionModels.SignedOutData) {
    return new SignedOut(ISODate.fromString(signedOutAt));
  }
}
