import {DomainEvent, IDomainEvent} from '@centsideas/event-sourcing';
import {AuthenticationEventNames} from '@centsideas/enums';

@DomainEvent(AuthenticationEventNames.TokensRefreshed)
export class TokensRefreshed implements IDomainEvent {
  serialize() {
    return {};
  }

  static deserialize() {
    return new TokensRefreshed();
  }
}
