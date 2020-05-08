import { injectable } from 'inversify';

import { EventRepository, EntityMapping } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { UsersEnvironment } from './users.environment';
import { User } from './user.entity';
import { UserErrors } from './errors';
import { IUserIdEmailMapping, IGoogleUserIdMapping, IUserIdUsernameMapping } from './models';

@injectable()
export class UserRepository extends EventRepository<User> {
  constructor(private env: UsersEnvironment) {
    super(User, env.databaseUrl, env.userDatabaseName, EventTopics.Users, 100);
  }

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
