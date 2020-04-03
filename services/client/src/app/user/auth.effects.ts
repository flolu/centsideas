import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { UserService } from './user.service';
import { AuthActions } from './auth.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private usersService: UserService,
    // TODO type
    private store: Store<any>,
  ) {}

  login$: any = createEffect(() =>
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

  confirmLogin$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.confirmLogin),
      switchMap(action =>
        this.usersService.confirmLogin(action.token).pipe(
          map(({ token, user }) => AuthActions.confirmLoginDone({ token, user })),
          catchError(error => of(AuthActions.confirmLoginFail({ error }))),
        ),
      ),
    ),
  );

  confirmLoginDone$: any = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.confirmLoginDone),
        tap(action => this.usersService.saveToken(action.token)),
        // TODO router navigation
        // tap(() => this.router.navigate([TopLevelFrontendRoutes.User])),
      ),
    { dispatch: false },
  );

  authenticate$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authenticate),
      switchMap(() =>
        this.usersService.authenticate().pipe(
          map(data => AuthActions.authenticateDone(data)),
          catchError(error => of(AuthActions.authenticateFail({ error }))),
        ),
      ),
    ),
  );

  authenticateDone$: any = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authenticateDone),
        tap(action => this.usersService.saveToken(action.token)),
        // TODO navigation
        // tap(() => this.router.navigate([TopLevelFrontendRoutes.User])),
      ),
    { dispatch: false },
  );

  authenticateFail$: any = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authenticateFail),
        tap(() => this.usersService.removeToken()),
      ),
    { dispatch: false },
  );
}
