import {injectable, inject} from 'inversify';

import {EventRepository} from '@centsideas/event-sourcing';
import {EventTopics} from '@centsideas/enums';

import {Login} from './login.entity';
import {UsersEnvironment} from './users.environment';

@injectable()
export class LoginRepository extends EventRepository<Login> {
  constructor(@inject(UsersEnvironment) env: UsersEnvironment) {
    super(Login, env.databaseUrl, env.loginDatabaseName, EventTopics.Logins);
  }
}
