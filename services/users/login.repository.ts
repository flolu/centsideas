import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { Login } from './login.entity';
import { UsersEnvironment } from './users.environment';

@injectable()
export class LoginRepository extends EventRepository<Login> {
  constructor(private messageBroker: MessageBroker, private env: UsersEnvironment) {
    super(
      messageBroker.dispatchEvents,
      Login,
      env.databaseUrl,
      env.loginDatabaseName,
      EventTopics.Logins,
    );
  }
}
