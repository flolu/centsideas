import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@cents-ideas/event-sourcing';
import { Logger } from '@cents-ideas/utils';
import { EventTopics } from '@cents-ideas/enums';

import { Login } from './login.entity';
import env from './environment';

@injectable()
export class LoginRepository extends EventRepository<Login> {
  constructor(private _messageBroker: MessageBroker, private _logger: Logger) {
    super(_messageBroker, _logger);
    this.initialize(Login, env.database.url, env.loginDatabaseName, EventTopics.Logins);
  }
}
