import { injectable } from 'inversify';
import * as faker from 'faker';
import * as jwt from 'jsonwebtoken';

import {
  sanitizeHtml,
  sendMail,
  decodeToken,
  TokenInvalidError,
  ThreadLogger,
  NotAuthenticatedError,
  NoPermissionError,
} from '@cents-ideas/utils';
import {
  IAuthenticatedDto,
  ITokenData,
  IAuthTokenPayload,
  ILoginTokenPayload,
  IEmailChangeTokenPayload,
} from '@cents-ideas/models';
import {
  TopLevelFrontendRoutes,
  AuthFrontendRoutes,
  QueryParamKeys,
  UserFrontendRoutes,
} from '@cents-ideas/enums';

import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserErrors } from './errors';
import env from './environment';
import { Login } from './login.entity';
import { LoginRepository } from './login.repository';
import { LoginEvents, UserEvents } from './events';

@injectable()
export class UserCommandHandler {
  constructor(private repository: UserRepository, private loginRepository: LoginRepository) {}

  login = async (email: string, t: ThreadLogger): Promise<Login> => {
    UserErrors.EmailRequiredError.validate(email);
    UserErrors.EmailInvalidError.validate(email);
    t.debug('login with email', email);

    const emailUserMapping = await this.repository.getUserIdEmailMapping(email);
    const firstLogin = !emailUserMapping;
    const loginId = await this.repository.generateUniqueId();
    t.debug(firstLogin ? 'first' : 'normal', 'login with loginId:', loginId);

    const tokenData: ITokenData = { type: 'login', payload: { loginId, email, firstLogin } };

    const token = jwt.sign(tokenData, env.jwtSecret, { expiresIn: env.loginTokenExpirationTime });

    t.debug('sendng login mail to ', email);
    const activationRoute: string = `${env.frontendUrl}/${TopLevelFrontendRoutes.Auth}/${AuthFrontendRoutes.Login}?${QueryParamKeys.Token}=${token}`;
    const expirationTimeHours = Math.floor(env.loginTokenExpirationTime / 3600);
    const text = `URL to login into your account: ${activationRoute} (URL will expire after ${expirationTimeHours} hours)`;
    const subject = 'CENTS Ideas Login';
    // FIXME consider outsourcing sending mails into its own mailing service, which listens for event liks LoginRequested
    await sendMail(env.mailing.fromAddress, email, subject, text, text, env.mailing.apiKey);
    t.debug('sent login confirmation email to', email);

    const login = Login.create(loginId, email, firstLogin);
    t.debug('start saving newly created login with id:', loginId);
    return this.loginRepository.save(login);
  };

  authenticate = async (token: string, t: ThreadLogger): Promise<IAuthenticatedDto> => {
    const data = decodeToken(token, env.jwtSecret);
    t.debug('authenticate with token', token ? token.slice(0, 30) : token);

    if (data.type === 'auth') {
      const payload: IAuthTokenPayload = data.payload as any;
      t.debug('authentication of user with id', payload.userId);

      const user = await this.repository.findById(payload.userId);
      if (!user) throw new TokenInvalidError(token, 'invalid userId');

      t.debug('confirmed that user exists');
      return {
        user: user.persistedState,
        token: this.renewAuthToken(token, data.iat, payload.userId),
      };
    }
    t.error('no auth token found');
    throw new TokenInvalidError(token, 'token is not an auth token');
  };

  confirmLogin = async (token: string, t: ThreadLogger): Promise<IAuthenticatedDto> => {
    const data = decodeToken(token, env.jwtSecret);
    t.debug('confirming login of token', token ? token.slice(0, 30) : token);

    if (data.type === 'login') {
      const payload: ILoginTokenPayload = data.payload as any;
      const login = await this.loginRepository.findById(payload.loginId);
      if (!login) throw new UserErrors.LoginNotFoundError(payload.loginId);
      t.debug('found login', login.persistedState.id);

      if (login && login.persistedState.confirmedAt)
        throw new TokenInvalidError(token, `This login was already confirmed`);

      if (payload.firstLogin && payload.loginId) {
        t.log('first login of user with email', payload.email);

        const createdUser = await this.handleUserCreation(payload.email, payload.loginId);
        const updatedToken = this.generateAuthToken(createdUser.persistedState.id);

        login.pushEvents(
          new LoginEvents.LoginConfirmedEvent(payload.loginId, createdUser.persistedState.id),
        );
        await this.loginRepository.save(login);
        t.debug('created user with id', createdUser.persistedState.id);
        t.debug('confirmed login', login.persistedState.id);

        return { user: createdUser.persistedState, token: updatedToken };
      }

      t.debug('normal login of user with email', payload.email);
      const emailUserMapping = await this.repository.getUserIdEmailMapping(payload.email);
      if (!emailUserMapping) throw new UserErrors.NoUserWithEmailError(payload.email);

      const user = await this.repository.findById(emailUserMapping.userId);
      if (!user) throw new TokenInvalidError(token, 'invalid userId');

      login.pushEvents(
        new LoginEvents.LoginConfirmedEvent(payload.loginId, user.persistedState.id),
      );
      await this.loginRepository.save(login);
      t.debug('confirmed login', login.persistedState.id);

      return {
        user: user.persistedState,
        token: this.renewAuthToken(token, data.iat, emailUserMapping.userId),
      };
    }

    t.error('not a login token');
    throw new TokenInvalidError(token, 'token is not a login token');
  };

  updateUser = async (
    authenticatedUserId: string | null,
    userId: string,
    username: string | null,
    email: string | null,
    t: ThreadLogger,
  ): Promise<User> => {
    if (!authenticatedUserId) throw new NotAuthenticatedError();
    NoPermissionError.validate(authenticatedUserId, userId);
    UserErrors.UserIdRequiredError.validate(userId);
    t.debug('update user with id', userId);
    t.debug('username: ', username, ', email:', email);

    if (username) {
      username = sanitizeHtml(username);
      UserErrors.UsernameRequiredError.validate(username);
      UserErrors.UsernameInvalidError.validate(username);
      t.debug('username', username, 'is valid');

      // FIXME check username uniqueness
    }

    if (email) {
      email = sanitizeHtml(email);
      UserErrors.EmailRequiredError.validate(email);
      UserErrors.EmailInvalidError.validate(email);
      t.debug('email', email, 'is valid');
    }

    const user = await this.repository.findById(userId);
    t.debug('found corresponding user');

    const isNewEmail = email && user.persistedState.email !== email;
    if (email && isNewEmail) await this.requestEmailChange(userId, email);

    user.update(username, isNewEmail ? email : null);
    return this.repository.save(user);
  };

  confirmEmailChange = async (token: string, t: ThreadLogger): Promise<User> => {
    const data = decodeToken(token, env.jwtSecret);
    if (data.type !== 'email-change') throw new TokenInvalidError(token);
    const payload: IEmailChangeTokenPayload = data.payload as any;
    t.debug('confirming email change with token', token ? token.slice(0, 30) : token);

    const user = await this.repository.findById(payload.userId);
    UserErrors.EmailMatchesCurrentEmailError.validate(user.persistedState.email, payload.newEmail);
    user.pushEvents(new UserEvents.EmailChangeConfirmedEvent(payload.userId, payload.newEmail));

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
      'sent email to notify user, that his email has changed from',
      payload.currentEmail,
      'to',
      payload.newEmail,
    );

    return this.repository.save(user);
  };

  private requestEmailChange = async (userId: string, newEmail: string): Promise<any> => {
    UserErrors.EmailRequiredError.validate(newEmail);
    UserErrors.EmailInvalidError.validate(newEmail);

    const user = await this.repository.findById(userId);
    UserErrors.EmailMatchesCurrentEmailError.validate(user.persistedState.email, newEmail);

    const emailUserMapping = await this.repository.getUserIdEmailMapping(newEmail);
    if (emailUserMapping) throw new UserErrors.EmailNotAvailableError(newEmail);

    const tokenPayload: IEmailChangeTokenPayload = {
      currentEmail: user.persistedState.email,
      newEmail,
      userId,
    };
    const tokenData: ITokenData = { type: 'email-change', payload: tokenPayload };
    const token = jwt.sign(tokenData, env.jwtSecret, {
      expiresIn: env.emailChangeTokenExpirationTime,
    });

    const activationRoute: string = `${env.frontendUrl}/${TopLevelFrontendRoutes.User}/${UserFrontendRoutes.Me}?${QueryParamKeys.ConfirmEmailChangeToken}=${token}`;
    const expirationTimeHours = Math.floor(env.emailChangeTokenExpirationTime / 3600);
    const text = `URL to change your email: ${activationRoute} (URL will expire after ${expirationTimeHours} hours)`;
    const subject = 'CENTS Ideas Email Change';
    return sendMail(env.mailing.fromAddress, newEmail, subject, text, text, env.mailing.apiKey);
  };

  private handleUserCreation = async (email: string, loginId: string): Promise<User> => {
    UserErrors.EmailRequiredError.validate(email);
    UserErrors.EmailInvalidError.validate(email);

    const emailUserMapping = await this.repository.getUserIdEmailMapping(email);
    if (emailUserMapping) throw new UserErrors.EmailAlreadySignedUpError(email);

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
