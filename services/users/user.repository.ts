import { injectable } from 'inversify';

import { EventRepository, MessageBroker, EntityMapping } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { UsersEnvironment } from './users.environment';
import { User } from './user.entity';
import { UserErrors } from './errors';
import { IUserIdEmailMapping, IGoogleUserIdMapping, IUserIdUsernameMapping } from './models';

@injectable()
export class UserRepository extends EventRepository<User> {
  emailMapping = new EntityMapping<IUserIdEmailMapping>(
    this.env.databaseUrl,
    'emails',
    'userId',
    'email',
  );

  usernameMapping = new EntityMapping<IUserIdUsernameMapping>(
    this.env.databaseUrl,
    'usernames',
    'userId',
    'username',
  );

  googleIdMapping = new EntityMapping<IGoogleUserIdMapping>(
    this.env.databaseUrl,
    'googleUserIds',
    'userId',
    'googleId',
  );

  constructor(private env: UsersEnvironment, private messageBroker: MessageBroker) {
    // TODO more fine-grain control over topics ... maybe each entity has its own topic?
    super(
      messageBroker.dispatchEvents,
      User,
      env.databaseUrl,
      env.userDatabaseName,
      EventTopics.Users,
      100,
    );
  }

  async checkUsernameAvailibility(username: string) {
    const existingUsername = await this.usernameMapping.get(username);
    if (existingUsername && existingUsername.userId)
      throw new UserErrors.UsernameUnavailableError(username);
    return true;
  }

  async checkEmailAvailability(email: string) {
    const existingEmail = await this.emailMapping.get(email);
    if (existingEmail && existingEmail.userId) throw new UserErrors.EmailNotAvailableError(email);
    return true;
  }
}
