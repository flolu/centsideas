import { Injectable } from '@angular/core';
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

export const TOKEN_KEY = 'token';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

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
    localStorage.setItem(TOKEN_KEY, token);
  };

  removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
  };

  get baseUrl() {
    // TODO dont hardcode (depends on issue with prod and dev envs)
    return `http://localhost:3000/${ApiEndpoints.Users}`;
    // return `${this.settingsService.settings.apiUrl}/${ApiEndpoints.Users}`;
  }

  get token() {
    return localStorage.getItem(TOKEN_KEY);
  }
}
