import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiEndpoints, UsersApiRoutes } from '@centsideas/enums';
import { IUserState, Dtos } from '@centsideas/models';

import { EnvironmentService } from '../../shared/environment/environment.service';

@Injectable()
export class UserService {
  constructor(private http: HttpClient, private environmentService: EnvironmentService) {}

  confirmEmailChange = (token: string): Observable<IUserState> => {
    const payload: Dtos.IConfirmEmailChangeDto = { token };
    const url = `${this.baseUrl}/${UsersApiRoutes.ConfirmEmailChange}`;
    return this.http.post<IUserState>(url, payload);
  };

  updateUser = (payload: Dtos.IUpdateUserDto, userId: string): Observable<IUserState> => {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.put<IUserState>(url, payload);
  };

  private get baseUrl() {
    return `${this.environmentService.env.gatewayHost}/${ApiEndpoints.Users}`;
  }
}
