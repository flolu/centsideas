import * as __rxjsTypes from 'rxjs';
import * as __ngrxStore from '@ngrx/store/store';

import { Component, OnDestroy } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { tap, take, takeWhile, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';

import { QueryParamKeys } from '@centsideas/enums';
import { IUserState, Dtos } from '@centsideas/models';

import { UserSelectors } from './user.selectors';
import { UserActions } from './user.actions';
import { AuthActions } from '../auth/auth.actions';
import { NotificationsSelectors } from './notifications/notifications.selectors';
import { NotificationsActions } from './notifications/notifications.actions';
import { PushNotificationService } from '../../shared/push-notifications/push-notification.service';
import { INotificationSettingsForm } from './notifications/notifications.state';

const selectChangeEmailToken = createSelector(
  createFeatureSelector<any>('router'),
  router => router.state.queryParams[QueryParamKeys.ConfirmEmailChangeToken],
);

// FIXME live indicator of username and email availability
// TODO live updating form
@Component({
  selector: 'ci-me',
  template: `
    <h1>Me</h1>
    <form [formGroup]="form">
      <label for="username">
        Username
      </label>
      <br />
      <input id="username" type="text" formControlName="username" />
      <br />
      <br />
      <label for="email">
        Email
      </label>
      <br />
      <input id="email" type="text" formControlName="email" />
      <br />
      <span>pending email: {{ user?.pendingEmail }}</span>
      <br />
      <br />
      <button (click)="onUpdate()">Update</button>
      <button (click)="onLogout()">Logout</button>
    </form>
    <ng-container *ngIf="notificationsState$ | async as state">
      <ci-notifications-form
        *ngIf="state.persisted"
        [status]="state.status"
        [formState]="state.persisted"
        (updateForm)="onUpdateNotificationSettingsForm($event)"
      ></ci-notifications-form>
    </ng-container>
  `,
  styleUrls: ['me.container.sass'],
})
export class MeContainer implements OnDestroy {
  notificationsState$ = this.store.select(NotificationsSelectors.selectNotificationsState);
  hasPushPermission = this.swPush.isEnabled;
  user: IUserState;
  alive = true;

  form = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
  });

  constructor(
    private store: Store,
    private router: Router,
    private swPush: SwPush,
    private pushService: PushNotificationService,
  ) {
    this.handleConfirmEmailChange();
    this.updateUserForm();
    this.store.dispatch(NotificationsActions.getSettings());
  }

  onLogout = () => this.store.dispatch(AuthActions.logout());

  onUpdate = () =>
    this.store.dispatch(
      UserActions.updateUser({
        email: this.form.value.email,
        username: this.form.value.username,
      }),
    );

  async onUpdateNotificationSettingsForm(event: INotificationSettingsForm) {
    this.store.dispatch(NotificationsActions.formChanged({ value: event }));
    if (event.sendPushes) {
      const sub = await this.pushService.ensurePushPermission();
      if (sub) this.store.dispatch(NotificationsActions.addPushSub({ subscription: sub }));
    }
  }

  onTestNotification = () => {
    if (this.pushService.areNotificationsBlocked) {
      // FIXME shoe somethine in UI or so
      console.log('you blocked the permision to send push notifications');
    }
    this.pushService.sendSampleNotificationLocally();
  };

  private updateUserForm = () =>
    this.store
      .select(UserSelectors.selectUserState)
      .pipe(
        tap(state => {
          if (!state.user) return;
          this.form.patchValue(state.user);
          this.user = state.user;
        }),
        takeWhile(() => this.alive),
      )
      .subscribe();

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

  ngOnDestroy() {
    this.alive = false;
  }
}
