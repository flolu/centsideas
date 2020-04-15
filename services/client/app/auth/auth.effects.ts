import * as __ngrxEffectsTypes from '@ngrx/effects/src/models';
import * as __ngrxStoreTypes from '@ngrx/store/src/models';
import * as __rxjsTypes from 'rxjs';

import { Injectable, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { isPlatformServer } from '@angular/common';

import { TopLevelFrontendRoutes, UserFrontendRoutes, CookieNames } from '@cents-ideas/enums';

import { AuthActions } from './auth.actions';
import { AuthService } from './auth.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private injector: Injector,
    @Inject(PLATFORM_ID) private platform,
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

  confirmLoginDone$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.confirmLoginDone),
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
          const refreshToken = expressRequest.cookies[CookieNames.RefreshToken];
          return this.authService.fetchAccessTokenOnServer(refreshToken).pipe(
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
