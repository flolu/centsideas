import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { UsersService } from './users.service';
import { UsersActions } from '.';
import { Router } from '@angular/router';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions, private usersService: UsersService, private router: Router) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.login),
      switchMap(({ email }) =>
        this.usersService.login(email).pipe(
          map(loginResponse =>
            loginResponse.existingAccount
              ? UsersActions.loginRequested(loginResponse)
              : UsersActions.signUpRequested(loginResponse),
          ),
          catchError(error => of(UsersActions.loginFail({ error }))),
        ),
      ),
    ),
  );

  confirmSignUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.confirmSignUp),
      switchMap(({ token }) =>
        this.usersService.confirmSignUp(token).pipe(
          map(data => UsersActions.confirmSignUpDone(data)),
          catchError(error => of(UsersActions.confirmSignUpFail({ error }))),
        ),
      ),
    ),
  );

  confirmSignUpDone$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.confirmSignUpDone),
        tap(action => this.usersService.saveToken(action.token)),
        // FIXME navigate to user settings or user profile
        tap(() => this.router.navigate([''])),
      ),
    { dispatch: false },
  );

  authenticate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.authenticate),
      switchMap(() =>
        this.usersService.authenticate().pipe(
          map(data => UsersActions.authenticateDone(data)),
          catchError(error => of(UsersActions.authenticateFail({ error }))),
        ),
      ),
    ),
  );

  authenticateDone$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.authenticateDone),
        tap(action => this.usersService.saveToken(action.token)),
      ),
    { dispatch: false },
  );

  authenticateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.authenticateFail),
        tap(() => this.usersService.removeToken()),
      ),
    { dispatch: false },
  );

  confirmSignUpFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.confirmSignUpFail),
        tap(() => this.router.navigate['']),
      ),
    { dispatch: false },
  );
}
