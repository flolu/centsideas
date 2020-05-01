import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { Login } from './login.entity';
import { UsersEnvironment } from './users.environment';

@injectable()
export class LoginRepository extends EventRepository<Login> {
  constructor(private _messageBroker: MessageBroker, private _env: UsersEnvironment) {
    super(
      _messageBroker.dispatchEvents,
      Login,
      _env.databaseUrl,
      _env.loginDatabaseName,
      EventTopics.Logins,
    );
  }
}
