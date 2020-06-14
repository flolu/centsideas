import {injectable} from 'inversify';
import * as http from 'http';

import {EventsHandler, EventHandler} from '@centsideas/event-sourcing';
import {AuthenticationEventNames} from '@centsideas/enums';
import {PersistedEvent, SessionModels} from '@centsideas/models';

@injectable()
export class MailingServer extends EventsHandler {
  consumerGroupName = 'centsideas.mailing';

  constructor() {
    super();
    http.createServer((_, res) => res.writeHead(200).end()).listen(3000);
  }

  @EventHandler(AuthenticationEventNames.SignInRequested)
  signInRequested(_event: PersistedEvent<SessionModels.SignInRequestedData>) {
    //
  }
}
