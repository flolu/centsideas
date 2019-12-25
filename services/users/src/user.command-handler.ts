import { injectable } from 'inversify';

import { sanitizeHtml } from '@cents-ideas/utils/src';

import { UserRepository } from './user.repository';
import { User } from './user.entity';
import {
  UserIdRequiredError,
  UsernameRequiredError,
  UsernameInvalidError,
  EmailRequiredError,
  EmailInvalidError,
} from './errors';

@injectable()
export class UserCommandHandler {
  constructor(private repository: UserRepository) {}

  // TODO make sure only authenticated user can do this (for its own data)
  updateUser = async (userId: string, username: string, email: string): Promise<User> => {
    UserIdRequiredError.validate(userId);
    username = sanitizeHtml(username);
    UsernameRequiredError.validate(username);
    EmailRequiredError.validate(email);
    UsernameInvalidError.validate(username);
    EmailInvalidError.validate(email);
    const user = await this.repository.findById(userId);
    const pendingEmail = user.persistedState.email !== email ? email : null;
    if (pendingEmail) {
      // TODO check if email already exists and return error if necessary
      // TODO dispatch email change request (and also send sth to the client, so it knows that the request has been sent)
    }
    user.update(username, pendingEmail);
    return this.repository.save(user);
  };
}
