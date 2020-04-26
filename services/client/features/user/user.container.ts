import * as __rxjsTypes from 'rxjs';
import * as __ngrxStore from '@ngrx/store/store';

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { tap, take } from 'rxjs/operators';
import { Router } from '@angular/router';

import { QueryParamKeys } from '@centsideas/enums';
import { IUserState } from '@centsideas/models';
import { AuthActions, AuthSelectors, RouterSelectors } from '@cic/store';
import { PushNotificationService } from '@cic/shared';
import {
  NotificationsSelectors,
  MeSelectors,
  NotificationsActions,
  INotificationSettingsForm,
  IMeForm,
  MeActions,
} from './store';

// FIXME live indicator of username and email availability
@Component({
  selector: 'cic-me',
  template: `
    <h1>Me</h1>
    <cic-user-me
      *ngIf="user$ | async as user"
      [status]="(meState$ | async).status"
      [formState]="user"
      (updateForm)="onUpdateUserForm($event)"
    ></cic-user-me>
    <button (click)="onLogout()">Logout</button>

    <cic-user-notifications
      *ngIf="notificationsState$ | async as state"
      [status]="state.status"
      [formState]="state.persisted"
      (updateForm)="onUpdateNotificationSettingsForm($event)"
    ></cic-user-notifications>
    <span *ngIf="!hasPushPermission">
      You need to allow notifications in your browser to receive push notifications!
    </span>
  `,
})
export class UserContainer {
  notificationsState$ = this.store.select(NotificationsSelectors.selectNotificationsState);
  meState$ = this.store.select(MeSelectors.selectMeState);
  user$ = this.store.select(AuthSelectors.selectUser);
  user: IUserState;
  form = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
  });
  hasPushPermission = this.pushService.hasNotificationPermission;

  constructor(
    private store: Store,
    private router: Router,
    private pushService: PushNotificationService,
  ) {
    this.handleConfirmEmailChange();
    this.store.dispatch(NotificationsActions.getSettings());
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }

  async onUpdateNotificationSettingsForm(event: INotificationSettingsForm) {
    this.store.dispatch(NotificationsActions.formChanged({ value: event }));
    if (event.sendPushes) {
      this.hasPushPermission = this.pushService.hasNotificationPermission;
      const sub = await this.pushService.ensurePushPermission();
      if (sub) this.store.dispatch(NotificationsActions.addPushSub({ subscription: sub }));
    }
  }

  onUpdateUserForm(event: IMeForm) {
    this.store.dispatch(MeActions.formChanged({ value: event }));
  }

  onTestNotification = () => {
    if (this.pushService.areNotificationsBlocked) {
      // FIXME show something in UI or so
      console.log('you blocked the permission to send push notifications');
    }
    this.pushService.sendSampleNotificationLocally();
  };

  private handleConfirmEmailChange = () =>
    this.store
      .select(RouterSelectors.selectQueryParam(QueryParamKeys.ConfirmEmailChangeToken))
      .pipe(
        tap(token => {
          if (token) {
            this.store.dispatch(MeActions.confirmEmailChange({ token }));
            this.router.navigate([], {
              queryParams: { [QueryParamKeys.ConfirmEmailChangeToken]: null },
              queryParamsHandling: 'merge',
            });
          }
        }),
        take(1),
      )
      .subscribe();
}
