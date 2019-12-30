import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { UsersService } from './users.service';
import { UsersActions } from '.';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions, private usersService: UsersService) {}

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
      ),
    { dispatch: false },
  );
}
