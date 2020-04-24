import * as __rxjsTypes from 'rxjs';

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiEndpoints, UsersApiRoutes } from '@centsideas/enums';
import { IUserState, Dtos } from '@centsideas/models';

import { ENVIRONMENT, IClientEnvironment } from '@cic/environment';

@Injectable()
export class UserService {
  private readonly baseUrl = `${this.environment.gatewayUrl}/${ApiEndpoints.Users}`;

  constructor(
    private http: HttpClient,
    @Inject(ENVIRONMENT) private environment: IClientEnvironment,
  ) {}

  confirmEmailChange(token: string) {
    const payload: Dtos.IConfirmEmailChangeDto = { token };
    const url = `${this.baseUrl}/${UsersApiRoutes.ConfirmEmailChange}`;
    return this.http.post<IUserState>(url, payload);
  }

  // FIXME acutally, we don't need userId, because we can refer to usr via it's access token
  updateUser(payload: Dtos.IUpdateUserDto, userId: string) {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.put<IUserState>(url, payload);
  }
}
