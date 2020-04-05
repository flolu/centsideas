import * as __ngrxEffectsTypes from '@ngrx/effects/src/models';
import * as __ngrxStoreTypes from '@ngrx/store/src/models';
import * as __rxjsTypes from 'rxjs';

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { TopLevelFrontendRoutes, AuthFrontendRoutes } from '@cents-ideas/enums';

import { UserService } from './user.service';
import { AuthActions } from './auth.actions';
import { UserSelectors } from './user.selectors';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private usersService: UserService,
    private router: Router,
    private store: Store,
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email }) =>
        this.usersService.login(email).pipe(
          map(() => AuthActions.loginDone()),
          catchError(error => of(AuthActions.loginFail({ error }))),
        ),
      ),
    ),
  );

  confirmLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.confirmLogin),
      withLatestFrom(this.store.select(UserSelectors.selectAuthState)),
      switchMap(([action, authState]) => {
        if (authState.token) {
          console.log(
            '[AuthEffects] a token was transfered from the server, login was already confirmed on the server',
          );
          this.usersService.saveToken(authState.token);
          return [];
        }
        return this.usersService.confirmLogin(action.token).pipe(
          map(({ token, user }) => AuthActions.confirmLoginDone({ token, user })),
          catchError(error => of(AuthActions.confirmLoginFail({ error }))),
        );
      }),
    ),
  );

  confirmLoginDone$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.confirmLoginDone),
        tap(action => this.usersService.saveToken(action.token)),
        tap(() => this.router.navigate([TopLevelFrontendRoutes.User, AuthFrontendRoutes.Me])),
      ),
    { dispatch: false },
  );

  authenticate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authenticate),
      switchMap(() => {
        if (this.usersService.token) {
          return this.usersService.authenticate().pipe(
            map(data => AuthActions.authenticateDone(data)),
            catchError(error => of(AuthActions.authenticateFail({ error }))),
          );
        } else {
          return [AuthActions.authenticateNoToken()];
        }
      }),
    ),
  );

  authenticateDone$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authenticateDone),
        tap(action => this.usersService.saveToken(action.token)),
      ),
    { dispatch: false },
  );

  authenticateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authenticateFail),
        tap(() => this.usersService.removeToken()),
      ),
    { dispatch: false },
  );
}
