import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiEndpoints, UsersApiRoutes, HeaderKeys } from '@cents-ideas/enums';
import {
  ILoginResponseDto,
  ILoginDto,
  IAuthenticatedDto,
  IAuthenticateDto,
  IConfirmSignUpResponseDto,
} from '@cents-ideas/models';

import { SettingsService } from '../settings.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class UsersService {
  private readonly API_ENDPOINT = ApiEndpoints.Users;

  constructor(private http: HttpClient, private settingsService: SettingsService) {}

  login = (email: string): Observable<ILoginResponseDto> => {
    const payload: ILoginDto = { email };
    const url = `${this.baseUrl}/${UsersApiRoutes.Login}`;
    return this.http.post<ILoginResponseDto>(url, payload);
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

  logout = () => {
    this.removeToken();
  };

  saveToken = (token: string) => {
    localStorage.setItem(environment.tokenKey, token);
  };

  removeToken = () => {
    localStorage.removeItem(environment.tokenKey);
  };

  get baseUrl() {
    return `${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}`;
  }

  get token() {
    return localStorage.getItem(environment.tokenKey);
  }
}
