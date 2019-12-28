import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { UsersService } from './users.service';
import { UsersActions } from '.';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

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
}
