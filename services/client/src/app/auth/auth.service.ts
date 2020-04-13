import { Injectable, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

import { ApiEndpoints, UsersApiRoutes, TokenExpirationTimes } from '@cents-ideas/enums';
import { IAuthenticatedDto, ILoginDto, IConfirmLoginDto } from '@cents-ideas/models';
import { EnvironmentService } from '../../shared/environment';

export const TOKEN_KEY = 'token';

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

  confirmLogin = (token: string): Observable<IAuthenticatedDto> => {
    const payload: IConfirmLoginDto = { token };
    const url = `${this.baseUrl}/${UsersApiRoutes.ConfirmLogin}`;
    return this.http.post<IAuthenticatedDto>(url, payload);
  };

  authenticate = (): Observable<IAuthenticatedDto> => {
    const url = `${this.baseUrl}/${UsersApiRoutes.Authenticate}`;
    return this.http.post<IAuthenticatedDto>(url, {});
  };

  logout = () => {
    this.removeToken();
  };

  saveToken = (token: string) => {
    this.removeToken();
    if (isPlatformBrowser(this.platform)) {
      document.cookie = `${TOKEN_KEY}=${token}; ; max-age=${TokenExpirationTimes.AuthToken};`;
    }
    if (isPlatformServer(this.platform)) {
      this.expressResponse.cookie(TOKEN_KEY, token, {
        maxAge: TokenExpirationTimes.AuthToken,
        httpOnly: true,
      });
    }
  };

  removeToken = () => {
    if (isPlatformBrowser(this.platform)) {
      document.cookie = '';
    }
    if (isPlatformServer(this.platform)) {
      this.expressResponse.clearCookie(TOKEN_KEY);
    }
  };

  private get baseUrl() {
    return `${this.environmentService.env.gatewayHost}/${ApiEndpoints.Users}`;
  }

  get token() {
    if (isPlatformBrowser(this.platform)) {
      return this.getCookieValue(document.cookie, TOKEN_KEY);
    }
    if (isPlatformServer(this.platform)) {
      return this.getCookieValue(this.expressRequest.headers.cookie, TOKEN_KEY);
    }
    return '';
  }

  private getCookieValue = (cookies: string, name: string): string => {
    cookies = cookies || '';
    const matches = cookies.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return matches ? matches.pop() : '';
  };
}
