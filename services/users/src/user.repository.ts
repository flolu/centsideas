import { injectable } from 'inversify';

import { EventRepository, MessageBroker } from '@cents-ideas/event-sourcing';
import { EventTopics } from '@cents-ideas/enums';
import { Logger } from '@cents-ideas/utils';

import env from './environment';
import { User } from './user.entity';

@injectable()
export class UserRepository extends EventRepository<User> {
  constructor(private _messageBroker: MessageBroker, private _logger: Logger) {
    super(_messageBroker, _logger);
    this.initialize(User, env.databaseUrl, env.userDatabaseName, EventTopics.Users);
  }
}
