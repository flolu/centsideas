import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { ApiEndpoints, UsersApiRoutes } from '@cents-ideas/enums';
import {
  ILoginResponseDto,
  ILoginDto,
  IAuthenticatedDto,
  IAuthenticateDto,
  IConfirmSignUpResponseDto,
} from '@cents-ideas/models';

import { SettingsService } from '../settings.service';

@Injectable()
export class UsersService {
  private readonly API_ENDPOINT = ApiEndpoints.Users;
  private readonly TOKEN_KEY = 'token';

  constructor(private http: HttpClient, private settingsService: SettingsService) {}

  login = (email: string): Observable<ILoginResponseDto> => {
    const payload: ILoginDto = { email };
    const url = `${this.baseUrl}/${UsersApiRoutes.Login}`;
    return this.http.post<ILoginResponseDto>(url, payload);
  };

  authenticate = (): Observable<IAuthenticatedDto> => {
    const payload: IAuthenticateDto = { authorization: this.token };
    const headers = new HttpHeaders({ ...payload });
    const url = `${this.baseUrl}/${UsersApiRoutes.Authenticate}`;
    // TODO create http interceptor to send token via header https://stackoverflow.com/questions/34464108
    return this.http.post<IAuthenticatedDto>(url, {}, { headers });
  };

  confirmSignUp = (token: string): Observable<IConfirmSignUpResponseDto> => {
    const payload: IAuthenticateDto = { authorization: token };
    const headers = new HttpHeaders({ ...payload });
    const url = `${this.baseUrl}/${UsersApiRoutes.ConfirmSignUp}`;
    return this.http.post<IConfirmSignUpResponseDto>(url, {}, { headers });
  };

  logout = () => {
    this.removeToken();
  };

  saveToken = (token: string) => {
    localStorage.setItem(this.TOKEN_KEY, token);
  };

  removeToken = () => {
    localStorage.removeItem(this.TOKEN_KEY);
  };

  get baseUrl() {
    return `${this.settingsService.settings.apiUrl}/${this.API_ENDPOINT}`;
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
