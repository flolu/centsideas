import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { UserService } from './user.service';
import { UserActions } from './user.actions';
import { UserSelectors } from './user.selectors';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private usersService: UserService,
    // TODO type
    private store: Store<any>,
  ) {}

  updateUser$: any = createEffect(() =>
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
}
