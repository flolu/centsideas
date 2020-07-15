import {injectable} from 'inversify';

import {EventsHandler, EventHandler} from '@centsideas/event-sourcing';
import {AuthenticationEventNames} from '@centsideas/enums';
import {PersistedEvent, SessionModels} from '@centsideas/models';

import {UserService} from './user.service';

@injectable()
export class UserListener extends EventsHandler {
  consumerGroupName = 'centsideas.user';

  constructor(private service: UserService) {
    super();
  }

  @EventHandler(AuthenticationEventNames.SignInConfirmed)
  async signInConfirmed(event: PersistedEvent<SessionModels.SignInConfirmedData>) {
    if (!event.data.isSignUp) return;
    await this.service.create(event.data.userId, event.data.email, event.data.confirmedAt);
  }

  @EventHandler(AuthenticationEventNames.GoogleSignInConfirmed)
  async googleSignInConfirmed(event: PersistedEvent<SessionModels.GoogleSignInConfirmedData>) {
    if (!event.data.isSignUp) return;
    await this.service.create(event.data.userId, event.data.email, event.data.confirmedAt);
  }
}
