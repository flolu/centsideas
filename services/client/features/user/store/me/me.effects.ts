import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {switchMap, map, catchError, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';

import {AuthSelectors, AuthActions} from '@cic/store';
import {MeService} from './me.service';
import {MeActions} from './me.actions';

@Injectable()
export class MeEffects {
  constructor(private actions$: Actions, private meService: MeService, private store: Store) {}

  formChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeActions.formChanged),
      map(({value}) => MeActions.updateUser(value)),
    ),
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeActions.updateUser),
      withLatestFrom(this.store.select(AuthSelectors.user)),
      switchMap(([payload, user]) =>
        this.meService.updateUser({username: payload.username, email: payload.email}, user.id).pipe(
          switchMap(updated => [
            MeActions.updateUserDone({updated}),
            AuthActions.overwriteUser({user: updated}),
          ]),
          catchError(error => of(MeActions.updateUserFail({error}))),
        ),
      ),
    ),
  );

  confirmEmailChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeActions.confirmEmailChange),
      switchMap(action =>
        this.meService.confirmEmailChange(action.token).pipe(
          switchMap(updated => [
            MeActions.confirmEmailChangeDone({updated}),
            AuthActions.overwriteUser({user: updated}),
          ]),
          catchError(error => of(MeActions.confirmEmailChangeFail({error}))),
        ),
      ),
    ),
  );
}
