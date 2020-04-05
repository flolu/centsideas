import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiEndpoints, UsersApiRoutes } from '@cents-ideas/enums';
import { IUpdateUserDto, IUserState, IConfirmEmailChangeDto } from '@cents-ideas/models';

import { env } from '../../environments';

export const TOKEN_KEY = 'token';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  confirmEmailChange = (token: string): Observable<IUserState> => {
    const payload: IConfirmEmailChangeDto = { token };
    const url = `${this.baseUrl}/${UsersApiRoutes.ConfirmEmailChange}`;
    return this.http.post<IUserState>(url, payload);
  };

  updateUser = (payload: IUpdateUserDto, userId: string): Observable<IUserState> => {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.put<IUserState>(url, payload);
  };

  get baseUrl() {
    return `${env.gatewayHost}/${ApiEndpoints.Users}`;
  }
}
