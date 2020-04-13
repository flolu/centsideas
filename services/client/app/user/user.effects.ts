import * as __ngrxEffectsTypes from '@ngrx/effects/src/models';
import * as __ngrxStoreTypes from '@ngrx/store/src/models';
import * as __rxjsTypes from 'rxjs';

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { UserService } from './user.service';
import { UserActions } from './user.actions';
import { UserSelectors } from './user.selectors';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private usersService: UserService, private store: Store) {}

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      withLatestFrom(this.store.select(UserSelectors.selectUser)),
      switchMap(([payload, user]) =>
        this.usersService.updateUser(payload, user.id).pipe(
          map(updated => UserActions.updateUserDone({ updated })),
          catchError(error => of(UserActions.updateUserFail({ error }))),
        ),
      ),
    ),
  );

  confirmEmailChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.confirmEmailChange),
      switchMap(action =>
        this.usersService.confirmEmailChange(action.token).pipe(
          map(updated => UserActions.confirmEmailChangeDone({ updated })),
          catchError(error => of(UserActions.confirmEmailChangeFail({ error }))),
        ),
      ),
    ),
  );
}
