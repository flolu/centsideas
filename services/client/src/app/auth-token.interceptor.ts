import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HeaderKeys } from '@cents-ideas/enums';

import { TOKEN_KEY } from './user/user.service';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(@Inject(PLATFORM_ID) private platform: string) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = isPlatformServer(this.platform) ? '' : localStorage.getItem(TOKEN_KEY);
    if (token) {
      req = req.clone({ setHeaders: { [HeaderKeys.Auth]: token } });
    }
    return next.handle(req);
  }
}
