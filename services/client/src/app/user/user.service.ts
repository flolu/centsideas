import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ApiEndpoints, UsersApiRoutes } from '@cents-ideas/enums';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IAuthenticatedDto,
  ILoginDto,
  IUpdateUserDto,
  IUserState,
  IConfirmEmailChangeDto,
  IConfirmLoginDto,
} from '@cents-ideas/models';
import { isPlatformServer } from '@angular/common';
import { env } from '../../environments';

export const TOKEN_KEY = 'token';

@Injectable()
export class UserService {
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platform: string) {}

  login = (email: string): Observable<{}> => {
    const payload: ILoginDto = { email };
    const url = `${this.baseUrl}/${UsersApiRoutes.Login}`;
    return this.http.post<{}>(url, payload);
  };

  authenticate = (): Observable<IAuthenticatedDto> => {
    const url = `${this.baseUrl}/${UsersApiRoutes.Authenticate}`;
    return this.http.post<IAuthenticatedDto>(url, {});
  };

  confirmLogin = (token: string): Observable<IAuthenticatedDto> => {
    const payload: IConfirmLoginDto = { token };
    const url = `${this.baseUrl}/${UsersApiRoutes.ConfirmLogin}`;
    return this.http.post<IAuthenticatedDto>(url, payload);
  };

  confirmEmailChange = (token: string): Observable<IUserState> => {
    const payload: IConfirmEmailChangeDto = { token };
    const url = `${this.baseUrl}/${UsersApiRoutes.ConfirmEmailChange}`;
    return this.http.post<IUserState>(url, payload);
  };

  updateUser = (payload: IUpdateUserDto, userId: string): Observable<IUserState> => {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.put<IUserState>(url, payload);
  };

  logout = () => {
    this.removeToken();
  };

  saveToken = (token: string) => {
    if (isPlatformServer(this.platform)) return;
    localStorage.setItem(TOKEN_KEY, token);
  };

  removeToken = () => {
    if (isPlatformServer(this.platform)) return;
    localStorage.removeItem(TOKEN_KEY);
  };

  get baseUrl() {
    return `${env.gatewayHost}/${ApiEndpoints.Users}`;
  }

  get token() {
    if (isPlatformServer(this.platform)) return '';
    return localStorage.getItem(TOKEN_KEY);
  }
}
