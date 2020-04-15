import { Injectable, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

import { ApiEndpoints, UsersApiRoutes } from '@cents-ideas/enums';
import {
  ILoginDto,
  IConfirmLoginDto,
  IConfirmedLoginDto,
  IRefreshedTokenDto,
} from '@cents-ideas/models';

import { EnvironmentService } from '../../shared/environment/environment.service';

@Injectable()
export class AuthService {
  private expressRequest: any;
  private expressResponse: any;

  constructor(
    private http: HttpClient,
    private injector: Injector,
    private environmentService: EnvironmentService,
    @Inject(PLATFORM_ID) private platform: string,
  ) {
    if (isPlatformServer(this.platform)) {
      this.expressRequest = this.injector.get(REQUEST);
      this.expressResponse = this.injector.get(RESPONSE);
    }
  }

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

  fetchAccesstoken = (): Observable<IRefreshedTokenDto> => {
    const url = `${this.baseUrl}/${UsersApiRoutes.RefreshToken}`;
    return this.http.post<IRefreshedTokenDto>(url, {});
  };

  private get baseUrl() {
    return `${this.environmentService.env.gatewayHost}/${ApiEndpoints.Users}`;
  }
}
