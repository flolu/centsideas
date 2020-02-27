import { injectable } from 'inversify';
import * as faker from 'faker';
import * as jwt from 'jsonwebtoken';

import { sanitizeHtml, sendMail, Logger } from '@cents-ideas/utils';
import { IConfirmSignUpResponseDto, IAuthenticatedDto, IAuthTokenData } from '@cents-ideas/models';
import { TopLevelFrontendRoutes } from '@cents-ideas/enums';

import { UserRepository } from './user.repository';
import { User } from './user.entity';
import {
  UserIdRequiredError,
  UsernameRequiredError,
  UsernameInvalidError,
  EmailRequiredError,
  EmailInvalidError,
  EmailAlreadySignedUpError,
} from './errors';
import env from './environment';
import { ISignUpTokenData } from './models';
import { TokenInvalidError } from './errors/token-invalid.error';

@injectable()
export class UserCommandHandler {
  constructor(private repository: UserRepository, private logger: Logger) {}

  login = async (email: string): Promise<boolean> => {
    EmailRequiredError.validate(email);
    EmailInvalidError.validate(email);
    const existing = await this.repository.getUserIdEmailMapping(email);

    if (existing && existing.userId) {
      const token = this.createAuthToken(existing.userId, '2h');
      this.logger.debug(`Found existing user with email: ${email}. Send an email with the login URL`);
      const activationRoute: string = `${env.frontendUrl}/${TopLevelFrontendRoutes.Login}?token=${token}`;
      await sendMail(
        env.mailing.fromAddress,
        email,
        'CENTS Ideas Login',
        `URL to login into your account: ${activationRoute} (URL will expire after 2 hours)`,
        `URL to login into your account: ${activationRoute} (URL will expire after 2 hours)`,
        env.mailing,
      );
      return true;
    } else {
      this.logger.debug(`No existing user with email: ${email}. Send email with registration URL`);
      const data: ISignUpTokenData = { email };
      const token = jwt.sign(data, env.jwtSecret, { expiresIn: '1h' });
      const activationRoute: string = `${env.frontendUrl}/${TopLevelFrontendRoutes.ConfirmSignUp}?token=${token}`;
      await sendMail(
        env.mailing.fromAddress,
        email,
        'CENTS Ideas Login',
        `URL to sign up your account: ${activationRoute}`,
        `URL to sign up your account: ${activationRoute}`,
        env.mailing,
      );
      return true;
    }
  };

  confirmSignUp = async (token: string): Promise<IConfirmSignUpResponseDto> => {
    let decoded: any;
    try {
      decoded = jwt.verify(token, env.jwtSecret);
    } catch (err) {
      throw new TokenInvalidError(token);
    }
    const email: string = decoded.email;
    EmailRequiredError.validate(email);
    EmailInvalidError.validate(email);
    const emailUserMapping = await this.repository.getUserIdEmailMapping(email);
    if (emailUserMapping) {
      throw new EmailAlreadySignedUpError(email);
    }
    const userId = await this.repository.generateUniqueId();
    const username: string = faker.internet
      .userName()
      .toLowerCase()
      .toString();
    const user = User.create(userId, email, username);
    await this.repository.insertEmail(userId, email);
    const updatedUser: User = await this.repository.save(user);
    const authToken = this.createAuthToken(userId);
    return { user: updatedUser.persistedState, token: authToken };
  };

  authenticate = async (token: string): Promise<IAuthenticatedDto> => {
    let decoded: any;
    try {
      decoded = jwt.verify(token, env.jwtSecret);
    } catch (err) {
      throw new TokenInvalidError(token);
    }

    const userId: string = decoded.userId;
    if (!userId) throw new TokenInvalidError(token, 'No userId in token payload');

    const user = await this.repository.findById(userId);
    if (!user) throw new TokenInvalidError(token, 'Invalid userId in token payload');

    const updatedToken = this.createAuthToken(userId);
    return { user: user.persistedState, token: updatedToken };
  };

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
    }
    user.update(username, pendingEmail);
    return this.repository.save(user);
  };

  confirmEmailChange = () => {};

  private createAuthToken = (userId: string, expiresIn: string = '7d'): string => {
    const data: IAuthTokenData = { userId };
    return jwt.sign(data, env.jwtSecret, { expiresIn });
  };
}
