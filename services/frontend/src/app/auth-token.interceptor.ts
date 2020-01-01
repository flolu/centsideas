import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HeaderKeys } from '@cents-ideas/enums';

import { environment } from 'src/environments/environment';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(environment.tokenKey);
    if (token) {
      req = req.clone({ setHeaders: { [HeaderKeys.Auth]: token } });
    }
    return next.handle(req);
  }
}
