import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { Login } from './login.entity';
import env from './environment';

@injectable()
export class LoginRepository extends EventRepository<Login> {
  constructor(private _messageBroker: MessageBroker) {
    super(_messageBroker);
    this.initialize(Login, env.databaseUrl, env.loginDatabaseName, EventTopics.Logins);
  }
}
