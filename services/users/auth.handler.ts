import { injectable } from 'inversify';
import * as faker from 'faker';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import * as queryString from 'query-string';

import { decodeToken, TokenInvalidError, Identifier } from '@centsideas/utils';
import { ILoginTokenPayload, IRefreshTokenPayload } from '@centsideas/models';
import { TopLevelFrontendRoutes, TokenExpirationTimes } from '@centsideas/enums';
import { GlobalEnvironment } from '@centsideas/environment';

import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserErrors } from './errors';
import { UsersEnvironment } from './users.environment';
import { Login } from './login.entity';
import { IGoogleUserinfo } from './models';
import { LoginRepository } from './login.repository';

@injectable()
export class AuthHandler {
  constructor(
    private userRepository: UserRepository,
    private loginRepository: LoginRepository,
    private env: UsersEnvironment,
    private globalEnv: GlobalEnvironment,
  ) {}

  login = async (email: string): Promise<Login> => {
    UserErrors.EmailRequiredError.validate(email);
    UserErrors.EmailInvalidError.validate(email);

    const emailUserMapping = await this.userRepository.emailMapping.get(email);
    const firstLogin = !emailUserMapping;
    const loginId = await this.loginRepository.generateAggregateId();

    const tokenData: ILoginTokenPayload = { loginId, email, firstLogin };
    const token = jwt.sign(tokenData, this.env.loginTokenSecret, {
      expiresIn: TokenExpirationTimes.LoginToken,
    });

    const login = Login.create(loginId, email, token, firstLogin);
    return this.loginRepository.save(login);
  };

  confirmLogin = async (token: string) => {
    const data = decodeToken(token, this.env.loginTokenSecret);

    const payload: ILoginTokenPayload = data;
    const login = await this.loginRepository.findById(payload.loginId);

    if (login && login.persistedState.confirmedAt)
      throw new TokenInvalidError(token, `This login was already confirmed`);

    if (payload.firstLogin && payload.loginId) {
      const createdUser = await this.handleUserCreation(payload.email);
      return this.handleConfirmedLogin(createdUser, login);
    }

    const emailUserMapping = await this.userRepository.emailMapping.get(payload.email);
    if (!emailUserMapping) throw new UserErrors.NoUserWithEmailError(payload.email);

    const user = await this.userRepository.findById(emailUserMapping.userId);

    return this.handleConfirmedLogin(user, login);
  };

  googleLoginRedirect = () => {
    const params = queryString.stringify({
      client_id: this.env.googleClientId,
      redirect_uri: this.getGoogleRedirectUri(),
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    });
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    return { url };
  };

  googleLogin = async (code: string) => {
    const userInfo = await this.fetchGoogleUserInfo(code);

    // FIXME send verification email manually
    if (!userInfo.verified_email)
      throw new Error('Please verify your Google email before signing in with Google');

    const existing = await this.userRepository.googleIdMapping.get(userInfo.id);
    if (existing) {
      const loginId = Identifier.makeLongId();
      const login = Login.createGoogleLogin(loginId, userInfo.email, false, userInfo.id);

      const user = await this.userRepository.findById(existing.userId);

      if (user.persistedState.email !== userInfo.email) {
        // FIXME consider asking the user to change email
      }

      return this.handleConfirmedLogin(user, login);
    } else {
      UserErrors.EmailRequiredError.validate(userInfo.email);
      UserErrors.EmailInvalidError.validate(userInfo.email);

      const emailUserMapping = await this.userRepository.emailMapping.get(userInfo.email);
      if (emailUserMapping) {
        const specialLogin = Login.createGoogleLogin(
          Identifier.makeLongId(),
          userInfo.email,
          false,
          userInfo.id,
        );

        const user = await this.userRepository.findById(emailUserMapping.userId);
        await this.userRepository.googleIdMapping.insert(user.persistedState.id, userInfo.id);

        return this.handleConfirmedLogin(user, specialLogin);
      }

      const loginId = Identifier.makeLongId();
      const login = Login.createGoogleLogin(loginId, userInfo.email, true, userInfo.id);

      const createdUser = await this.handleUserCreation(userInfo.email, [
        userInfo.name.replace(' ', '_'),
        userInfo.given_name.replace(' ', '_'),
      ]);
      await this.userRepository.googleIdMapping.insert(createdUser.persistedState.id, userInfo.id);
      return this.handleConfirmedLogin(createdUser, login);
    }
  };

  refreshToken = async (token: string) => {
    const data: IRefreshTokenPayload = decodeToken(token, this.env.refreshTokenSecret);

    const user = await this.userRepository.findById(data.userId);

    if (user.persistedState.refreshTokenId !== data.tokenId)
      throw new TokenInvalidError(token, 'token was invalidated');

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { accessToken, refreshToken, user: user.persistedState };
  };

  // FIXME implement such that access to this controller is only for admins
  revokeRefreshToken = async (userId: string, reason: string) => {
    UserErrors.UserIdRequiredError.validate(userId);

    const user = await this.userRepository.findById(userId);

    const refreshTokenId = Identifier.makeLongId();
    user.revokeRefreshToken(refreshTokenId, reason);

    // FIXME maybe send email to user
    return this.userRepository.save(user);
  };

  logout = async (userId: string) => {
    UserErrors.UserIdRequiredError.validate(userId);

    const user = await this.userRepository.findById(userId);
    user.logout();

    return this.userRepository.save(user);
  };

  private handleUserCreation = async (
    email: string,
    usernamesToTry: string[] = [],
  ): Promise<User> => {
    UserErrors.EmailRequiredError.validate(email);
    UserErrors.EmailInvalidError.validate(email);

    await this.userRepository.checkEmailAvailability(email);

    const username = await this.generateUsername(usernamesToTry);

    const userId = await this.userRepository.generateAggregateId();
    const refreshTokenId = Identifier.makeLongId();
    const user = User.create(userId, email, username, refreshTokenId);

    // FIXME somehow make sure all three succeed to complete the user creation (we probably need compensations events if not)
    await this.userRepository.usernameMapping.insert(userId, username);
    await this.userRepository.emailMapping.insert(userId, email);
    return this.userRepository.save(user);
  };

  private handleConfirmedLogin = async (user: User, login: Login) => {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    login.confirmLogin(login.currentState.id, user.persistedState.id);
    await this.loginRepository.save(login);

    return { user: user.persistedState, accessToken, refreshToken };
  };

  private generateAccessToken = (user: User) => {
    return jwt.sign({ userId: user.persistedState.id }, this.env.accessTokenSecret, {
      expiresIn: TokenExpirationTimes.AccessToken,
    });
  };

  private generateRefreshToken = (user: User) => {
    return jwt.sign(
      {
        userId: user.persistedState.id,
        tokenId: user.persistedState.refreshTokenId,
      },
      this.env.refreshTokenSecret,
      { expiresIn: TokenExpirationTimes.RefreshToken },
    );
  };

  private fetchGoogleUserInfo = async (code: string): Promise<IGoogleUserinfo> => {
    UserErrors.GoogleLoginCodeRequiredError.validate(code);

    const tokensResponse = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: 'post',
      data: {
        client_id: this.env.googleClientId,
        client_secret: this.env.googleClientSecret,
        redirect_uri: this.getGoogleRedirectUri(),
        grant_type: 'authorization_code',
        code,
      },
    });
    const { access_token } = tokensResponse.data;
    if (!access_token) throw new Error('Google access token could not be acquired');

    const userInfoResponse = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const userInfo: IGoogleUserinfo = userInfoResponse.data;
    if (!userInfo || !userInfo.id || !userInfo.email)
      throw new Error('Google user info could not be acquire');

    return userInfo;
  };

  private getGoogleRedirectUri = () => {
    const frontendUrl = this.globalEnv.mainClientUrl;
    return `${frontendUrl}/${TopLevelFrontendRoutes.Login}`;
  };

  private generateUsername = (usernames: string[] = []) => {
    let counter = -1;
    const maxTries = 5;

    const check = (): Promise<string> =>
      new Promise(async (resolve, reject) => {
        counter++;
        const name = usernames[counter] || faker.internet.userName();
        const available = await this.userRepository.checkUsernameAvailibility(name);
        if (available) return resolve(name);
        if (counter >= maxTries) reject(`Usernsame couldn't be generated`);
        resolve(check());
      });

    return check();
  };
}
