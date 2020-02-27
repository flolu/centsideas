import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { TopLevelFrontendRoutes } from '@cents-ideas/enums';

import { UsersService } from './users.service';
import { UsersActions, UsersSelectors } from '.';
import { AppState } from '..';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    private router: Router,
    private store: Store<AppState>,
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.login),
      switchMap(({ email }) =>
        this.usersService.login(email).pipe(
          map(() => UsersActions.loginDone()),
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
        tap(() => this.router.navigate([TopLevelFrontendRoutes.User])),
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
        tap(() => this.router.navigate([TopLevelFrontendRoutes.User])),
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

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      withLatestFrom(this.store.select(UsersSelectors.selectUser)),
      switchMap(([payload, user]) =>
        this.usersService.updateUser(payload, user.id).pipe(
          map(updated => UsersActions.updateUserDone({ updated })),
          catchError(error => of(UsersActions.updateUserFail({ error }))),
        ),
      ),
    ),
  );
}
