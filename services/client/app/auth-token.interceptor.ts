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
import { take, map, first, flatMap, catchError, withLatestFrom } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';

import { HeaderKeys, HttpStatusCodes } from '@cents-ideas/enums';

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
      // TODO tes what happens if fetch fail will be called
      // TODO not sure if this works to listen for two actions
      ofType(AuthActions.fetchAccessTokenDone, AuthActions.fetchAccessTokenFail),
      first(),
      // withLatestFrom(AuthSelectors.selectAuthState),
      flatMap(() => {
        return this.store.select(AuthSelectors.selectAuthState).pipe(
          first(),
          flatMap(authState => {
            console.log({ authState });
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
