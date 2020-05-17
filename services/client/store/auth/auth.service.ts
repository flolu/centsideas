import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ENVIRONMENT, IClientEnvironment} from '@cic/environment';
import {ApiEndpoints, AuthApiRoutes} from '@centsideas/enums';
import {Dtos} from '@centsideas/models';

@Injectable()
export class AuthService {
  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private environment: IClientEnvironment,
  ) {}

  login(email: string) {
    const payload: Dtos.ILoginDto = {email};
    const url = `${this.baseUrl}/${AuthApiRoutes.Login}`;
    return this.http.post<{}>(url, payload);
  }

  confirmLogin(token: string) {
    const payload: Dtos.IConfirmLoginDto = {loginToken: token};
    const url = `${this.baseUrl}/${AuthApiRoutes.ConfirmLogin}`;
    return this.http.post<Dtos.IConfirmedLoginDto>(url, payload);
  }

  googleLoginRedirect() {
    const url = `${this.baseUrl}/${AuthApiRoutes.GoogleLoginRedirect}`;
    return this.http.get<Dtos.IGoogleLoginRedirectDto>(url);
  }

  googleLogin(code: string) {
    const payload: Dtos.IGoogleLoginDto = {code};
    const url = `${this.baseUrl}/${AuthApiRoutes.GoogleLogin}`;
    return this.http.post<Dtos.IGoogleLoggedInDto>(url, payload);
  }

  fetchAccessTokenOnServer(refreshToken: string, exchangeSecret: string) {
    const url = `${this.baseUrl}/${AuthApiRoutes.RefreshToken}`;
    return this.http.post<Dtos.IRefreshedTokenDto>(url, {refreshToken, exchangeSecret});
  }

  fetchAccessToken() {
    const url = `${this.baseUrl}/${AuthApiRoutes.RefreshToken}`;
    return this.http.post<Dtos.IRefreshedTokenDto>(url, {});
  }

  logout() {
    const url = `${this.baseUrl}/${AuthApiRoutes.Logout}`;
    return this.http.post<{}>(url, {});
  }

  private get baseUrl() {
    return `${this.environment.gatewayUrl}/${ApiEndpoints.Auth}`;
  }
}
