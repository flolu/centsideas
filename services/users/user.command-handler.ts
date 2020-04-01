import { injectable } from 'inversify';
import * as faker from 'faker';
import * as jwt from 'jsonwebtoken';

import { sanitizeHtml, sendMail, Logger } from '@cents-ideas/utils';
import { IAuthenticatedDto } from '@cents-ideas/models';
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
import { ITokenData, IFullTokenData } from './models';
import { TokenInvalidError } from './errors/token-invalid.error';

@injectable()
export class UserCommandHandler {
  constructor(private repository: UserRepository, private logger: Logger) {}

  login = async (email: string): Promise<boolean> => {
    EmailRequiredError.validate(email);
    EmailInvalidError.validate(email);
    const existing = await this.repository.getUserIdEmailMapping(email);

    this.logger.debug(`Existing user: ${existing}. Send an email with the login URL to ${email}`);
    const userId = existing?.userId ? existing.userId : null;
    const tokenData: ITokenData = { email, userId, firstLogin: !userId };
    const expirationHours = 2;
    const token = jwt.sign(tokenData, env.jwtSecret, { expiresIn: expirationHours * 3600 });
    const activationRoute: string = `${env.frontendUrl}/${TopLevelFrontendRoutes.Login}?token=${token}`;
    const text = `URL to login into your account: ${activationRoute} (URL will expire after ${expirationHours} hours)`;
    await sendMail(
      env.mailing.fromAddress,
      email,
      'CENTS Ideas Login',
      text,
      text,
      env.mailing.apiKey,
    );
    return true;
  };

  authenticate = async (token: string): Promise<IAuthenticatedDto> => {
    let decoded: any;
    try {
      decoded = jwt.verify(token, env.jwtSecret);
      this.logger.debug(`decoded token: `, decoded);
    } catch (err) {
      throw new TokenInvalidError(token);
    }

    const data: IFullTokenData = decoded;
    let user: User;
    let generateNewToken = false;

    if (data.firstLogin) {
      user = await this.handleFirstAuthentication(data.email);
      generateNewToken = true;
    } else {
      user = await this.handleAuthentication(data.userId, token);
      const timeSinceTokenCreation = Date.now() - data.iat;
      generateNewToken = timeSinceTokenCreation > 24 * 60 * 60;
    }

    let updatedToken = token;
    if (generateNewToken) {
      const tokenData: ITokenData = {
        email: user.persistedState.email,
        userId: user.persistedState.id,
        firstLogin: false,
      };
      updatedToken = jwt.sign(tokenData, env.jwtSecret, { expiresIn: '7d' });
    }

    return { user: user.persistedState, token: updatedToken };
  };

  private handleFirstAuthentication = async (email: string): Promise<User> => {
    EmailRequiredError.validate(email);
    EmailInvalidError.validate(email);

    const emailUserMapping = await this.repository.getUserIdEmailMapping(email);
    if (emailUserMapping) throw new EmailAlreadySignedUpError(email);

    const userId = await this.repository.generateUniqueId();
    const username: string = faker.internet.userName().toLowerCase().toString();
    const user = User.create(userId, email, username);

    await this.repository.insertEmail(userId, email);
    return this.repository.save(user);
  };

  private handleAuthentication = async (userId: string | null, token: string): Promise<User> => {
    if (!userId) throw new TokenInvalidError(token, 'No userId in token payload');

    const user = await this.repository.findById(userId);
    if (!user) throw new TokenInvalidError(token, 'Invalid userId in token payload');

    return user;
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
      // ...
    }
    user.update(username, pendingEmail);
    return this.repository.save(user);
  };

  confirmEmailChange = () => {
    // ...
  };
}
