import * as __ngrxEffectsTypes from '@ngrx/effects/src/models';
import * as __ngrxStoreTypes from '@ngrx/store/src/models';
import * as __rxjsTypes from 'rxjs';

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';

import { NotificationsService } from './notifications.service';
import { NotificationsActions } from './notifications.actions';
import { PushNotificationService } from '../../../shared/push-notifications/push-notification.service';

@Injectable()
export class NotificationsEffects {
  constructor(
    private actions$: Actions,
    private notficationsService: NotificationsService,
    private pushService: PushNotificationService,
    private store: Store,
  ) {}

  formChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.formChanged),
      map(({ value }) => {
        return NotificationsActions.updateSettings({ settings: value });
      }),
    ),
  );

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
  getSettingsDone$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationsActions.getSettingsDone),
        tap(async ({ settings }) => {
          if (settings.sendPushes && !this.pushService.hasNotificationPermission) {
            const sub = await this.pushService.ensurePushPermission();
            if (sub) {
              this.store.dispatch(NotificationsActions.addPushSub({ subscription: sub }));
            }
          }
        }),
      ),
    { dispatch: false },
  );
}
