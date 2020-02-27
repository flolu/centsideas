import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiEndpoints, UsersApiRoutes, HeaderKeys } from '@cents-ideas/enums';
import {
  ILoginDto,
  IAuthenticatedDto,
  IAuthenticateDto,
  IConfirmSignUpResponseDto,
  IUpdateUserDto,
  IUserState,
} from '@cents-ideas/models';

import { SettingsService } from '../settings.service';

export const TOKEN_KEY = 'token';

@Injectable()
export class UsersService {
  private readonly API_ENDPOINT = ApiEndpoints.Users;

  constructor(private http: HttpClient, private settingsService: SettingsService) {}

  login = (email: string): Observable<{}> => {
    const payload: ILoginDto = { email };
    const url = `${this.baseUrl}/${UsersApiRoutes.Login}`;
    return this.http.post<{}>(url, payload);
  };

  authenticate = (): Observable<IAuthenticatedDto> => {
    const url = `${this.baseUrl}/${UsersApiRoutes.Authenticate}`;
    return this.http.post<IAuthenticatedDto>(url, {});
  };

  confirmSignUp = (token: string): Observable<IConfirmSignUpResponseDto> => {
    const payload: IAuthenticateDto = { [HeaderKeys.Auth]: token };
    const headers = new HttpHeaders({ ...payload });
    const url = `${this.baseUrl}/${UsersApiRoutes.ConfirmSignUp}`;
    return this.http.post<IConfirmSignUpResponseDto>(url, {}, { headers });
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
    return `${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}`;
  }

  get token() {
    return localStorage.getItem(TOKEN_KEY);
  }
}
