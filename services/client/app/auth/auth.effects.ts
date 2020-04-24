import * as __ngrxEffectsTypes from '@ngrx/effects/src/models';
import * as __ngrxStoreTypes from '@ngrx/store/src/models';
import * as __rxjsTypes from 'rxjs';

import { Injectable, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Router } from '@angular/router';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { isPlatformServer, DOCUMENT, isPlatformBrowser } from '@angular/common';

import { TopLevelFrontendRoutes, UserFrontendRoutes, CookieNames } from '@centsideas/enums';

import { AuthActions } from './auth.actions';
import { AuthService } from './auth.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private injector: Injector,
    @Inject(PLATFORM_ID) private platform,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email }) =>
        this.authService.login(email).pipe(
          map(() => AuthActions.loginDone()),
          catchError(error => of(AuthActions.loginFail({ error }))),
        ),
      ),
    ),
  );

  confirmLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.confirmLogin),
      switchMap(action =>
        this.authService.confirmLogin(action.token).pipe(
          map(({ accessToken, user }) => AuthActions.confirmLoginDone({ accessToken, user })),
          catchError(error => of(AuthActions.confirmLoginFail({ error }))),
        ),
      ),
    ),
  );

  googleLoginRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.googleLoginRedirect),
      switchMap(() =>
        this.authService.googleLoginRedirect().pipe(
          map(({ url }) => AuthActions.googleLoginRedirectDone({ url })),
          catchError(error => of(AuthActions.googleLoginRedirectFail({ error }))),
        ),
      ),
    ),
  );

  googleLoginRedirectDone$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.googleLoginRedirectDone),
        tap(({ url }) => {
          if (isPlatformBrowser(this.platform)) {
            this.document.location.href = url;
          }
        }),
      ),
    { dispatch: false },
  );

  googleLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.googleLogin),
      switchMap(({ code }) =>
        this.authService.googleLogin(code).pipe(
          map(({ user, accessToken }) => AuthActions.googleLoginDone({ user, accessToken })),
          catchError(error => of(AuthActions.googleLoginFail({ error }))),
        ),
      ),
    ),
  );

  // FIXME ask for push permissions if user has push notification turned on
  confirmLoginDone$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.confirmLoginDone, AuthActions.googleLoginDone),
        tap(() => this.router.navigate([TopLevelFrontendRoutes.User, UserFrontendRoutes.Me])),
      ),
    { dispatch: false },
  );

  fetchAccessToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.fetchAccessToken),
      switchMap(() => {
        if (isPlatformServer(this.platform)) {
          const expressRequest = this.injector.get(REQUEST);
          const refreshToken = (expressRequest as any).cookies[CookieNames.RefreshToken];
          const exchangeSecret = process.env.FRONTEND_SERVER_EXCHANGE_SECRET;
          return this.authService.fetchAccessTokenOnServer(refreshToken, exchangeSecret).pipe(
            map(data => AuthActions.fetchAccessTokenDone(data)),
            catchError(error => of(AuthActions.fetchAccessTokenFail({ error }))),
          );
        }
        return this.authService.fetchAccessToken().pipe(
          map(data => AuthActions.fetchAccessTokenDone(data)),
          catchError(error => of(AuthActions.fetchAccessTokenFail({ error }))),
        );
      }),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutDone()),
          catchError(error => of(AuthActions.logoutFail({ error }))),
        ),
      ),
    ),
  );

  logoutDone$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutDone),
        tap(() => this.router.navigate([TopLevelFrontendRoutes.Ideas])),
      ),
    { dispatch: false },
  );
}
