import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { first, flatMap, catchError } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';

import { HeaderKeys, HttpStatusCodes } from '@centsideas/enums';

import { AuthSelectors } from './auth/auth.selectors';
import { AuthActions } from './auth/auth.actions';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private store: Store, private actions: Actions) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(AuthSelectors.selectAuthState).pipe(
      first(),
      flatMap(authState => {
        req = this.setRequestAuthHeader(req, authState.accessToken);
        return next.handle(req).pipe(
          catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === HttpStatusCodes.Unauthorized)
              return this.handleAccessTokenRefresh(req, next);
            return throwError(error);
          }),
        );
      }),
    );
  }

  private handleAccessTokenRefresh = (
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> => {
    this.store.dispatch(AuthActions.fetchAccessToken());
    return this.actions.pipe(
      ofType(AuthActions.fetchAccessTokenDone, AuthActions.fetchAccessTokenFail),
      first(),
      flatMap(() => {
        return this.store.select(AuthSelectors.selectAuthState).pipe(
          first(),
          flatMap(authState => {
            const request = this.setRequestAuthHeader(req, authState.accessToken);
            return next.handle(request);
          }),
        );
      }),
    );
  };

  private setRequestAuthHeader = (req: HttpRequest<any>, accessToken: string): HttpRequest<any> => {
    const setHeaders = { [HeaderKeys.Auth]: `Bearer ${accessToken}` };
    return req.clone({ setHeaders, withCredentials: true });
  };
}
