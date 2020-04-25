import * as __rxjsTypes from 'rxjs';
import * as __ngrxStore from '@ngrx/store/store';

import { Component } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { tap, take } from 'rxjs/operators';
import { Router } from '@angular/router';

import { QueryParamKeys } from '@centsideas/enums';
import { IUserState } from '@centsideas/models';
import { PushNotificationService } from '@cic/push-notifications';
import { UserSelectors } from './user.selectors';
import { UserActions } from './user.actions';
import { AuthActions } from '../auth/auth.actions';
import { NotificationsSelectors } from './notifications/notifications.selectors';
import { NotificationsActions } from './notifications/notifications.actions';
import { INotificationSettingsForm } from './notifications/notifications.state';
import { IUserForm } from './user.state';
import { AuthSelectors } from '../auth/auth.selectors';

const selectChangeEmailToken = createSelector(
  createFeatureSelector<any>('router'),
  router => router.state.queryParams[QueryParamKeys.ConfirmEmailChangeToken],
);

// FIXME live indicator of username and email availability
@Component({
  selector: 'cic-me',
  template: `
    <h1>Me</h1>
    <cic-me-form
      *ngIf="user$ | async as user"
      [status]="(userState$ | async).status"
      [formState]="user"
      (updateForm)="onUpdateUserForm($event)"
    ></cic-me-form>
    <button (click)="onLogout()">Logout</button>

    <cic-notifications-form
      *ngIf="notificationsState$ | async as state"
      [status]="state.status"
      [formState]="state.persisted"
      (updateForm)="onUpdateNotificationSettingsForm($event)"
    ></cic-notifications-form>
    <span *ngIf="!hasPushPermission">
      You need to allow notifications in your browser to receive push notifications!
    </span>
  `,
  styleUrls: ['me.container.sass'],
})
export class MeContainer {
  notificationsState$ = this.store.select(NotificationsSelectors.selectNotificationsState);
  userState$ = this.store.select(UserSelectors.selectUserState);
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

  onUpdateUserForm(event: IUserForm) {
    this.store.dispatch(UserActions.formChanged({ value: event }));
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
      .select(selectChangeEmailToken)
      .pipe(
        tap(token => {
          if (token) {
            this.store.dispatch(UserActions.confirmEmailChange({ token }));
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
