import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { take, map } from 'rxjs/operators';

import { HeaderKeys } from '@cents-ideas/enums';

import { AuthSelectors } from './auth/auth.selectors';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({ withCredentials: true });
    this.store
      .select(AuthSelectors.selectAuthState)
      .pipe(
        take(1),
        map(authState => {
          const setHeaders = { [HeaderKeys.Auth]: authState.accessToken };
          req = req.clone({ setHeaders });
        }),
      )
      .subscribe();
    return next.handle(req);
  }
}
