import { injectable } from 'inversify';

import { EventRepository, MessageBroker, EntityMapping } from '@centsideas/event-sourcing';
import { EventTopics } from '@centsideas/enums';

import { UsersEnvironment } from './users.environment';
import { User } from './user.entity';
import { UserErrors } from './errors';
import { IUserIdEmailMapping, IGoogleUserIdMapping, IUserIdUsernameMapping } from './models';

@injectable()
export class UserRepository extends EventRepository<User> {
  private entityKeyId = 'userId';
  emailMapping = new EntityMapping<IUserIdEmailMapping>(
    this.env.databaseUrl,
    'emails',
    this.entityKeyId,
    'email',
  );
  usernameMapping = new EntityMapping<IUserIdUsernameMapping>(
    this.env.databaseUrl,
    'usernames',
    this.entityKeyId,
    'username',
  );
  googleIdMapping = new EntityMapping<IGoogleUserIdMapping>(
    this.env.databaseUrl,
    'googleUserIds',
    this.entityKeyId,
    'googleId',
  );

  constructor(private _messageBroker: MessageBroker, private env: UsersEnvironment) {
    super(_messageBroker);
    // TODO those things into super
    this.initialize(User, this.env.databaseUrl, this.env.userDatabaseName, EventTopics.Users);
  }

  checkUsernameAvailibility = async (username: string): Promise<boolean> => {
    const existingUsername = await this.usernameMapping.get(username);
    if (existingUsername && existingUsername.userId)
      throw new UserErrors.UsernameUnavailableError(username);
    return true;
  };

  checkEmailAvailability = async (email: string): Promise<boolean> => {
    const existingEmail = await this.emailMapping.get(email);
    if (existingEmail && existingEmail.userId) throw new UserErrors.EmailNotAvailableError(email);
    return true;
  };
}
