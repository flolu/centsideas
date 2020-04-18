import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiEndpoints, UsersApiRoutes } from '@centsideas/enums';
import { Dtos } from '@centsideas/models';

import { EnvironmentService } from '../../shared/environment/environment.service';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private environmentService: EnvironmentService) {}

  login = (email: string): Observable<{}> => {
    const payload: Dtos.ILoginDto = { email };
    const url = `${this.baseUrl}/${UsersApiRoutes.Login}`;
    return this.http.post<{}>(url, payload);
  };

  confirmLogin = (token: string): Observable<Dtos.IConfirmedLoginDto> => {
    const payload: Dtos.IConfirmLoginDto = { loginToken: token };
    const url = `${this.baseUrl}/${UsersApiRoutes.ConfirmLogin}`;
    return this.http.post<Dtos.IConfirmedLoginDto>(url, payload);
  };

  googleLoginRedirect = (): Observable<Dtos.IGoogleLoginRedirectDto> => {
    const url = `${this.baseUrl}/${UsersApiRoutes.GoogleLoginRedirect}`;
    return this.http.get<Dtos.IGoogleLoginRedirectDto>(url);
  };

  googleLogin = (code: string): Observable<Dtos.IGoogleLoggedInDto> => {
    const payload: Dtos.IGoogleLoginDto = { code };
    const url = `${this.baseUrl}/${UsersApiRoutes.GoogleLogin}`;
    return this.http.post<Dtos.IGoogleLoggedInDto>(url, payload);
  };

  fetchAccessTokenOnServer = (
    refreshToken: string,
    exchangeSecret: string,
  ): Observable<Dtos.IRefreshedTokenDto> => {
    const url = `${this.baseUrl}/${UsersApiRoutes.RefreshToken}`;
    return this.http.post<Dtos.IRefreshedTokenDto>(url, { refreshToken, exchangeSecret });
  };

  fetchAccessToken = (): Observable<Dtos.IRefreshedTokenDto> => {
    const url = `${this.baseUrl}/${UsersApiRoutes.RefreshToken}`;
    return this.http.post<Dtos.IRefreshedTokenDto>(url, {});
  };

  logout = (): Observable<{}> => {
    const url = `${this.baseUrl}/${UsersApiRoutes.Logout}`;
    return this.http.post<{}>(url, {});
  };

  private get baseUrl() {
    return `${this.environmentService.env.gatewayHost}/${ApiEndpoints.Users}`;
  }
}
