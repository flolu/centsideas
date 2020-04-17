import { injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';

import {
  sanitizeHtml,
  sendMail,
  decodeToken,
  ThreadLogger,
  NotAuthenticatedError,
  NoPermissionError,
} from '@centsideas/utils';
import { IEmailChangeTokenPayload } from '@centsideas/models';
import {
  TopLevelFrontendRoutes,
  QueryParamKeys,
  UserFrontendRoutes,
  TokenExpirationTimes,
} from '@centsideas/enums';

import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserErrors } from './errors';
import env from './environment';

@injectable()
export class UserCommandHandler {
  constructor(private userRepository: UserRepository) {}

  updateUser = async (
    auid: string | null,
    userId: string,
    username: string | null,
    email: string | null,
    t: ThreadLogger,
  ): Promise<User> => {
    if (!auid) throw new NotAuthenticatedError();
    NoPermissionError.validate(auid, userId);
    UserErrors.UserIdRequiredError.validate(userId);
    t.debug('update user with id', userId);
    t.debug('username: ', username, ', email:', email);

    if (username) {
      username = sanitizeHtml(username);
      UserErrors.UsernameRequiredError.validate(username);
      UserErrors.UsernameInvalidError.validate(username);
      t.debug('username', username, 'is valid');
    }

    if (email) {
      email = sanitizeHtml(email);
      UserErrors.EmailRequiredError.validate(email);
      UserErrors.EmailInvalidError.validate(email);
      t.debug('email', email, 'is valid');
    }

    const user = await this.userRepository.findById(userId);
    t.debug('found corresponding user');

    const isNewUsername = user && user.persistedState.username !== username;
    if (username && isNewUsername) {
      await this.userRepository.checkUsernameAvailibility(username);
      t.debug(`username ${username} available`);
    }

    const isNewEmail = email && user.persistedState.email !== email;
    if (email && isNewEmail) {
      await this.userRepository.checkEmailAvailability(email);
      t.debug('email is available');
      await this.requestEmailChange(userId, email);
    }

    user.update(username, isNewEmail ? email : null);

    if (username) await this.userRepository.updateUsername(userId, username);
    return this.userRepository.save(user);
  };

  confirmEmailChange = async (token: string, t: ThreadLogger): Promise<User> => {
    const data = decodeToken(token, env.tokenSecrets.changeEmailToken);
    const payload: IEmailChangeTokenPayload = data;
    t.debug('confirming email change with token', token ? token.slice(0, 30) : token);

    await this.userRepository.checkEmailAvailability(payload.newEmail);

    const user = await this.userRepository.findById(payload.userId);
    UserErrors.EmailMatchesCurrentEmailError.validate(user.persistedState.email, payload.newEmail);
    user.confirmEmailChange(payload.newEmail);

    const subject = 'CENTS Ideas Email Was Changed';
    const text = `You have changed your email adress from ${payload.currentEmail} to ${payload.newEmail}`;
    await sendMail(
      env.mailing.fromAddress,
      payload.currentEmail,
      subject,
      text,
      text,
      env.mailing.apiKey,
    );
    t.debug(
      'sent email to notify user, that his email has changed',
      `from ${payload.currentEmail} to ${payload.newEmail}`,
    );

    await this.userRepository.updateEmail(user.persistedState.id, payload.newEmail);
    return this.userRepository.save(user);
  };

  private requestEmailChange = async (userId: string, newEmail: string): Promise<any> => {
    UserErrors.EmailRequiredError.validate(newEmail);
    UserErrors.EmailInvalidError.validate(newEmail);

    const user = await this.userRepository.findById(userId);
    UserErrors.EmailMatchesCurrentEmailError.validate(user.persistedState.email, newEmail);

    const emailUserMapping = await this.userRepository.getUserIdEmailMapping(newEmail);
    if (emailUserMapping) throw new UserErrors.EmailNotAvailableError(newEmail);

    const tokenPayload: IEmailChangeTokenPayload = {
      currentEmail: user.persistedState.email,
      newEmail,
      userId,
    };
    const token = jwt.sign(tokenPayload, env.tokenSecrets.changeEmailToken, {
      expiresIn: TokenExpirationTimes.EmailChangeToken,
    });

    const activationRoute: string = `${env.frontendUrl}/${TopLevelFrontendRoutes.User}/${UserFrontendRoutes.Me}?${QueryParamKeys.ConfirmEmailChangeToken}=${token}`;
    const expirationTimeHours = Math.floor(TokenExpirationTimes.EmailChangeToken / 3600);
    const text = `URL to change your email: ${activationRoute} (URL will expire after ${expirationTimeHours} hours)`;
    const subject = 'CENTS Ideas Email Change';
    return sendMail(env.mailing.fromAddress, newEmail, subject, text, text, env.mailing.apiKey);
  };
}
