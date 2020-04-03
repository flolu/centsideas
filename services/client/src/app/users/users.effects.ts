import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { UsersService } from './users.service';
import { UsersActions } from './users.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    // TODO type
    private store: Store<any>,
  ) {}

  login$: any = createEffect(() =>
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

  confirmLogin$: any = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.confirmLogin),
      switchMap(action =>
        this.usersService.confirmLogin(action.token).pipe(
          map(({ token, user }) => UsersActions.confirmLoginDone({ token, user })),
          catchError(error => of(UsersActions.confirmLoginFail({ error }))),
        ),
      ),
    ),
  );

  confirmLoginDone$: any = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.confirmLoginDone),
        tap(action => this.usersService.saveToken(action.token)),
        // TODO router navigation
        // tap(() => this.router.navigate([TopLevelFrontendRoutes.User])),
      ),
    { dispatch: false },
  );

  authenticate$: any = createEffect(() =>
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

  authenticateDone$: any = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.authenticateDone),
        tap(action => this.usersService.saveToken(action.token)),
        // TODO navigation
        // tap(() => this.router.navigate([TopLevelFrontendRoutes.User])),
      ),
    { dispatch: false },
  );

  authenticateFail$: any = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.authenticateFail),
        tap(() => this.usersService.removeToken()),
      ),
    { dispatch: false },
  );

  // TODO create selector
  /* updateUser$ = createEffect(() =>
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
  ); */
}
