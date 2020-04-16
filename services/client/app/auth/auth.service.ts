import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiEndpoints, UsersApiRoutes } from '@cents-ideas/enums';
import {
  ILoginDto,
  IConfirmLoginDto,
  IConfirmedLoginDto,
  IRefreshedTokenDto,
  IGoogleLoginDto,
  IGoogleLoginRedirectDto,
  IGoogleLoggedInDto,
} from '@cents-ideas/models';

import { EnvironmentService } from '../../shared/environment/environment.service';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private environmentService: EnvironmentService) {}

  login = (email: string): Observable<{}> => {
    const payload: ILoginDto = { email };
    const url = `${this.baseUrl}/${UsersApiRoutes.Login}`;
    return this.http.post<{}>(url, payload);
  };

  confirmLogin = (token: string): Observable<IConfirmedLoginDto> => {
    const payload: IConfirmLoginDto = { loginToken: token };
    const url = `${this.baseUrl}/${UsersApiRoutes.ConfirmLogin}`;
    return this.http.post<IConfirmedLoginDto>(url, payload);
  };

  googleLoginRedirect = (): Observable<IGoogleLoginRedirectDto> => {
    const url = `${this.baseUrl}/${UsersApiRoutes.GoogleLoginRedirect}`;
    return this.http.get<IGoogleLoginRedirectDto>(url);
  };

  googleLogin = (code: string): Observable<IGoogleLoggedInDto> => {
    const payload: IGoogleLoginDto = { code };
    const url = `${this.baseUrl}/${UsersApiRoutes.GoogleLogin}`;
    return this.http.post<IGoogleLoggedInDto>(url, payload);
  };

  fetchAccessTokenOnServer = (refreshToken: string): Observable<IRefreshedTokenDto> => {
    const url = `${this.baseUrl}/${UsersApiRoutes.RefreshToken}`;
    return this.http.post<IRefreshedTokenDto>(url, { refreshToken });
  };

  // TODO this request is expected to fail at some point (...so don't throw error)... only throw error if it is unexpected error
  fetchAccessToken = (): Observable<IRefreshedTokenDto> => {
    const url = `${this.baseUrl}/${UsersApiRoutes.RefreshToken}`;
    return this.http.post<IRefreshedTokenDto>(url, {});
  };

  logout = (): Observable<{}> => {
    const url = `${this.baseUrl}/${UsersApiRoutes.Logout}`;
    return this.http.post<{}>(url, {});
  };

  private get baseUrl() {
    return `${this.environmentService.env.gatewayHost}/${ApiEndpoints.Users}`;
  }
}
