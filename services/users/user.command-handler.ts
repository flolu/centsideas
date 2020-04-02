import { injectable } from 'inversify';
import * as faker from 'faker';
import * as jwt from 'jsonwebtoken';

import { sanitizeHtml, sendMail, Logger } from '@cents-ideas/utils';
import {
  IAuthenticatedDto,
  ITokenData,
  IAuthTokenPayload,
  ILoginTokenPayload,
  ITokenDataFull,
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
} from './errors';
import env from './environment';
import { TokenInvalidError } from './errors/token-invalid.error';
import { Login } from './login.entity';
import { LoginRepository } from './login.repository';
import { LoginConfirmedEvent } from './events/login-confirmed.event';

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
    let decoded: any;
    try {
      decoded = jwt.verify(token, env.jwtSecret);
    } catch (err) {
      throw new TokenInvalidError(token);
    }

    const data: ITokenDataFull = decoded;
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
    }

    if (email) {
      EmailRequiredError.validate(email);
      EmailInvalidError.validate(email);
    }

    const user = await this.repository.findById(userId);

    const isNewEmail = email && user.persistedState.email !== email;
    const isNewUsername = username && user.persistedState.username !== username;

    if (isNewEmail) {
      // TODO handle email change requested
    }

    user.update(isNewUsername ? username : null, isNewEmail ? email : null);
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
