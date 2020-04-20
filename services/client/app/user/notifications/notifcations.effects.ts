import * as __ngrxEffectsTypes from '@ngrx/effects/src/models';
import * as __ngrxStoreTypes from '@ngrx/store/src/models';
import * as __rxjsTypes from 'rxjs';

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { NotificationsService } from './notifications.service';
import { NotificationsActions } from './notifications.actions';

@Injectable()
export class NotificationsEffects {
  constructor(private actions$: Actions, private notficationsService: NotificationsService) {}

  // TODO generic effects factory function?
  addPushSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.addPushSub),
      switchMap(action =>
        this.notficationsService.addPushSubscription(action.subscription).pipe(
          map(settings => NotificationsActions.addPushSubDone({ settings })),
          catchError(error => of(NotificationsActions.addPushSubFail({ error }))),
        ),
      ),
    ),
  );

  updateSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.updateSettings),
      switchMap(action =>
        this.notficationsService.updateSettings(action.settings).pipe(
          map(settings => NotificationsActions.updateSettingsDone({ settings })),
          catchError(error => of(NotificationsActions.updateSettingsFail({ error }))),
        ),
      ),
    ),
  );

  getSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.getSettings),
      switchMap(() =>
        this.notficationsService.getSettings().pipe(
          map(settings => NotificationsActions.getSettingsDone({ settings })),
          catchError(error => of(NotificationsActions.getSettingsFail({ error }))),
        ),
      ),
    ),
  );
}
