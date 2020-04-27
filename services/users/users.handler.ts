import { injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';

import {
  sanitizeHtml,
  decodeToken,
  NotAuthenticatedError,
  NoPermissionError,
} from '@centsideas/utils';
import { IEmailChangeTokenPayload } from '@centsideas/models';
import { TokenExpirationTimes } from '@centsideas/enums';

import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserErrors } from './errors';
import { UsersEnvironment } from './users.environment';

@injectable()
export class UsersHandler {
  constructor(private userRepository: UserRepository, private env: UsersEnvironment) {}

  updateUser = async (
    auid: string | null,
    userId: string,
    username: string | null,
    email: string | null,
  ): Promise<User> => {
    if (!auid) throw new NotAuthenticatedError();
    NoPermissionError.validate(auid, userId);
    UserErrors.UserIdRequiredError.validate(userId);

    if (username) {
      username = sanitizeHtml(username);
      UserErrors.UsernameRequiredError.validate(username);
      UserErrors.UsernameInvalidError.validate(username);
    }

    if (email) {
      email = sanitizeHtml(email);
      UserErrors.EmailRequiredError.validate(email);
      UserErrors.EmailInvalidError.validate(email);
    }

    let user = await this.userRepository.findById(userId);

    const isNewUsername = user && user.persistedState.username !== username;
    if (username && isNewUsername) {
      await this.userRepository.checkUsernameAvailibility(username);
    }

    const isNewEmail = email && user.persistedState.email !== email;
    if (email && isNewEmail) {
      await this.userRepository.checkEmailAvailability(email);
      user = await this.requestEmailChange(userId, email);
    }

    user.update(username, isNewEmail ? email : null);

    if (username) await this.userRepository.usernameMapping.update(userId, username);
    const saved: User = await this.userRepository.save(user);
    return saved;
  };

  confirmEmailChange = async (token: string): Promise<User> => {
    const data = decodeToken(token, this.env.tokenSecrets.changeEmailToken);
    const payload: IEmailChangeTokenPayload = data;

    await this.userRepository.checkEmailAvailability(payload.newEmail);

    const user = await this.userRepository.findById(payload.userId);
    UserErrors.EmailMatchesCurrentEmailError.validate(user.persistedState.email, payload.newEmail);
    user.confirmEmailChange(payload.newEmail, payload.currentEmail);

    await this.userRepository.emailMapping.update(user.persistedState.id, payload.newEmail);
    return this.userRepository.save(user);
  };

  private requestEmailChange = async (userId: string, newEmail: string): Promise<User> => {
    UserErrors.EmailRequiredError.validate(newEmail);
    UserErrors.EmailInvalidError.validate(newEmail);

    const user = await this.userRepository.findById(userId);
    UserErrors.EmailMatchesCurrentEmailError.validate(user.persistedState.email, newEmail);

    const emailUserMapping = await this.userRepository.emailMapping.get(newEmail);
    if (emailUserMapping) throw new UserErrors.EmailNotAvailableError(newEmail);

    const tokenPayload: IEmailChangeTokenPayload = {
      currentEmail: user.persistedState.email,
      newEmail,
      userId,
    };
    const token = jwt.sign(tokenPayload, this.env.tokenSecrets.changeEmailToken, {
      expiresIn: TokenExpirationTimes.EmailChangeToken,
    });

    return user.requestEmailChange(newEmail, token);
  };
}
