import { injectable } from 'inversify';
import * as faker from 'faker';
import * as jwt from 'jsonwebtoken';

import { sanitizeHtml, sendMail, Logger, decodeToken } from '@cents-ideas/utils';
import {
  IAuthenticatedDto,
  ITokenData,
  IAuthTokenPayload,
  ILoginTokenPayload,
  ITokenDataFull,
  IEmailChangeTokenPayload,
} from '@cents-ideas/models';
import { TopLevelFrontendRoutes } from '@cents-ideas/enums';

import { UserRepository } from './user.repository';
import { User } from './user.entity';
// TODO import as something like UserErrors
import {
  UserIdRequiredError,
  UsernameRequiredError,
  UsernameInvalidError,
  EmailRequiredError,
  EmailInvalidError,
  EmailAlreadySignedUpError,
  NoUserWithEmailError,
  EmailNotAvailableError,
} from './errors';
import env from './environment';
import { TokenInvalidError } from '../../packages/utils/errors/token-invalid.error';
import { Login } from './login.entity';
import { LoginRepository } from './login.repository';
import { LoginConfirmedEvent } from './events/login-confirmed.event';
import { EmailMatchesCurrentEmailError } from './errors/email-matches-current-email.error';
import { EmailChangeConfirmedEvent } from './events/email-change-confirmed.event';

@injectable()
export class UserCommandHandler {
  constructor(
    private repository: UserRepository,
    private loginRepository: LoginRepository,
    private logger: Logger,
  ) {}

  login = async (email: string): Promise<boolean> => {
    EmailRequiredError.validate(email);
    EmailInvalidError.validate(email);

    const emailUserMapping = await this.repository.getUserIdEmailMapping(email);
    const firstLogin = !emailUserMapping;
    const loginId = await this.repository.generateUniqueId();

    const tokenData: ITokenData = { type: 'login', payload: { loginId, email, firstLogin } };

    const token = jwt.sign(tokenData, env.jwtSecret, { expiresIn: env.loginTokenExpirationTime });
    const activationRoute: string = `${env.frontendUrl}/${TopLevelFrontendRoutes.Login}?token=${token}`;
    const expirationTimeHours = Math.floor(env.loginTokenExpirationTime / 3600);
    const text = `URL to login into your account: ${activationRoute} (URL will expire after ${expirationTimeHours} hours)`;
    const subject = 'CENTS Ideas Login';
    // FIXME consider outsourcing sending mails into its own mailing service, which listens for event liks LoginRequested
    await sendMail(env.mailing.fromAddress, email, subject, text, text, env.mailing.apiKey);

    const login = Login.create(loginId, email, firstLogin);
    return this.loginRepository.save(login);
  };

  authenticate = async (token: string): Promise<IAuthenticatedDto> => {
    const data = decodeToken(token, env.jwtSecret);
    this.logger.debug('authenticate', data);

    if (data.type === 'login') {
      const payload: ILoginTokenPayload = data.payload as any;
      const login = await this.loginRepository.findById(payload.loginId);

      if (payload.firstLogin && payload.loginId) {
        this.logger.log(`first login of ${payload.email}`);

        const createdUser = await this.handleUserCreation(payload.email, payload.loginId);
        const updatedToken = this.generateAuthToken(createdUser.persistedState.id);

        login.pushEvents(new LoginConfirmedEvent(payload.loginId, createdUser.persistedState.id));
        return { user: createdUser.persistedState, token: updatedToken };
      }

      this.logger.log(`login of ${payload.email}`);
      const emailUserMapping = await this.repository.getUserIdEmailMapping(payload.email);
      if (!emailUserMapping) throw new NoUserWithEmailError(payload.email);

      const user = await this.repository.findById(emailUserMapping.userId);
      if (!user) throw new TokenInvalidError(token, 'invalid userId');

      login.pushEvents(new LoginConfirmedEvent(payload.loginId, user.persistedState.id));
      return {
        user: user.persistedState,
        token: this.renewAuthToken(token, data.iat, emailUserMapping.userId),
      };
    }

    if (data.type === 'auth') {
      const payload: IAuthTokenPayload = data.payload as any;
      this.logger.log(`authentication of ${payload.userId}`);

      const user = await this.repository.findById(payload.userId);
      if (!user) throw new TokenInvalidError(token, 'invalid userId');

      return {
        user: user.persistedState,
        token: this.renewAuthToken(token, data.iat, payload.userId),
      };
    }

    this.logger.error(
      `no authentication method could be used. it was neither a login nor a general authentication`,
    );
    throw new TokenInvalidError(token);
  };

  updateUser = async (
    userId: string,
    username: string | null,
    email: string | null,
  ): Promise<User> => {
    UserIdRequiredError.validate(userId);

    if (username) {
      username = sanitizeHtml(username);
      UsernameRequiredError.validate(username);
      UsernameInvalidError.validate(username);

      // FIXME check username uniqueness
    }

    if (email) {
      EmailRequiredError.validate(email);
      EmailInvalidError.validate(email);
    }

    const user = await this.repository.findById(userId);

    const isNewEmail = email && user.persistedState.email !== email;
    const isNewUsername = username && user.persistedState.username !== username;

    if (email && isNewEmail) await this.requestEmailChange(userId, email);

    user.update(isNewUsername ? username : null, isNewEmail ? email : null);
    return this.repository.save(user);
  };

  confirmEmailChange = async (token: string): Promise<User> => {
    const data = decodeToken(token, env.jwtSecret);
    if (data.type !== 'email-change') throw new TokenInvalidError(token);
    const payload: IEmailChangeTokenPayload = data.payload as any;

    const user = await this.repository.findById(payload.userId);
    user.pushEvents(new EmailChangeConfirmedEvent(payload.userId, payload.newEmail));

    const subject = 'CENTS Ideas Email Was Changed';
    const text = `You have changed your email adress from ${payload.currentEmail} to ${payload.newEmail}`;
    await sendMail(
      env.mailing.fromAddress,
      payload.newEmail,
      subject,
      text,
      text,
      env.mailing.apiKey,
    );

    return this.repository.save(user);
  };

  private requestEmailChange = async (userId: string, newEmail: string): Promise<any> => {
    EmailRequiredError.validate(newEmail);
    EmailInvalidError.validate(newEmail);

    const user = await this.repository.findById(userId);
    EmailMatchesCurrentEmailError.validate(user.persistedState.email, newEmail);

    const emailUserMapping = await this.repository.getUserIdEmailMapping(newEmail);
    if (emailUserMapping) throw new EmailNotAvailableError(newEmail);

    const tokenPayload: IEmailChangeTokenPayload = {
      currentEmail: user.persistedState.email,
      newEmail,
      userId,
    };
    const tokenData: ITokenData = { type: 'email-change', payload: tokenPayload };
    const token = jwt.sign(tokenData, env.jwtSecret, {
      expiresIn: env.emailChangeTokenExpirationTime,
    });

    const activationRoute: string = `${env.frontendUrl}/${TopLevelFrontendRoutes.User}?confirmEmailChangeToken=${token}`;
    const expirationTimeHours = Math.floor(env.emailChangeTokenExpirationTime / 3600);
    const text = `URL to change your email: ${activationRoute} (URL will expire after ${expirationTimeHours} hours)`;
    const subject = 'CENTS Ideas Email Change';
    return sendMail(env.mailing.fromAddress, newEmail, subject, text, text, env.mailing.apiKey);
  };

  private handleUserCreation = async (email: string, loginId: string): Promise<User> => {
    EmailRequiredError.validate(email);
    EmailInvalidError.validate(email);

    const emailUserMapping = await this.repository.getUserIdEmailMapping(email);
    if (emailUserMapping) throw new EmailAlreadySignedUpError(email);

    const userId = await this.repository.generateUniqueId();
    // FIXME username uniqueness?!
    const username: string = faker.internet.userName().toLowerCase().toString();
    const user = User.create(userId, email, username);

    await this.repository.insertEmail(userId, email);
    return this.repository.save(user);
  };

  private renewAuthToken = (oldToken: string, tokenCreatedTime: number, userId: string): string => {
    const generateNewToken = Date.now() - tokenCreatedTime > env.timeUntilGenerateNewToken;
    return generateNewToken ? this.generateAuthToken(userId) : oldToken;
  };

  private generateAuthToken = (userId: string): string => {
    const payload: IAuthTokenPayload = { userId };
    const data: ITokenData = { type: 'auth', payload };
    return jwt.sign(data, env.jwtSecret, { expiresIn: env.authTokenExpirationTime });
  };
}
