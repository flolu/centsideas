import {DomainEvent} from '@centsideas/event-sourcing';
import {AuthenticationEventNames} from '@centsideas/enums';

@DomainEvent(AuthenticationEventNames.RefreshTokenRevoked)
export class RefreshTokenRevoked {
  serialize() {
    return {};
  }

  static deserialize() {
    return new RefreshTokenRevoked();
  }
}
