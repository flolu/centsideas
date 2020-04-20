import * as __rxjsTypes from 'rxjs';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiEndpoints, UsersApiRoutes } from '@centsideas/enums';
import { Dtos } from '@centsideas/models';

import { EnvironmentService } from '../../shared/environment/environment.service';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private environmentService: EnvironmentService) {}

  login(email: string) {
    const payload: Dtos.ILoginDto = { email };
    const url = `${this.baseUrl}/${UsersApiRoutes.Login}`;
    return this.http.post<{}>(url, payload);
  }

  confirmLogin(token: string) {
    const payload: Dtos.IConfirmLoginDto = { loginToken: token };
    const url = `${this.baseUrl}/${UsersApiRoutes.ConfirmLogin}`;
    return this.http.post<Dtos.IConfirmedLoginDto>(url, payload);
  }

  googleLoginRedirect() {
    const url = `${this.baseUrl}/${UsersApiRoutes.GoogleLoginRedirect}`;
    return this.http.get<Dtos.IGoogleLoginRedirectDto>(url);
  }

  googleLogin(code: string) {
    const payload: Dtos.IGoogleLoginDto = { code };
    const url = `${this.baseUrl}/${UsersApiRoutes.GoogleLogin}`;
    return this.http.post<Dtos.IGoogleLoggedInDto>(url, payload);
  }

  fetchAccessTokenOnServer(refreshToken: string, exchangeSecret: string) {
    const url = `${this.baseUrl}/${UsersApiRoutes.RefreshToken}`;
    return this.http.post<Dtos.IRefreshedTokenDto>(url, { refreshToken, exchangeSecret });
  }

  fetchAccessToken() {
    const url = `${this.baseUrl}/${UsersApiRoutes.RefreshToken}`;
    return this.http.post<Dtos.IRefreshedTokenDto>(url, {});
  }

  logout() {
    const url = `${this.baseUrl}/${UsersApiRoutes.Logout}`;
    return this.http.post<{}>(url, {});
  }

  private get baseUrl() {
    return `${this.environmentService.env.gatewayHost}/${ApiEndpoints.Users}`;
  }
}
