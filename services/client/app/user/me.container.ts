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
import { PushNotificationService } from './notifications/push-notification.service';
import { NotificationsActions } from './notifications/notifications.actions';

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
    <h1>Notifications</h1>
    <form [formGroup]="notificatoinsForm">
      <label>
        <input formControlName="sendEmails" type="checkbox" />
        <span>Email</span>
      </label>
      <br />
      <label>
        <input formControlName="sendPushes" type="checkbox" />
        <span>Push</span>
      </label>
      <br />
      <button (click)="onSaveNotificationSettings()">Save</button>
      <br />
    </form>
    <button (click)="onTestNotification()">Test notification</button>
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

  notificatoinsForm = new FormGroup({
    sendEmails: new FormControl(),
    sendPushes: new FormControl(),
  });

  constructor(
    private store: Store,
    private router: Router,
    private swPush: SwPush,
    private pushService: PushNotificationService,
  ) {
    this.handleConfirmEmailChange();
    this.updateUserForm();
    this.updateNotificationForm();
    this.listenNotificationFormChanges();
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

  onTestNotification = () => this.pushService.sendSampleNotificationLocally();

  onSaveNotificationSettings() {
    this.store.dispatch(
      NotificationsActions.updateSettings({ settings: this.notificatoinsForm.value }),
    );
  }

  private listenNotificationFormChanges() {
    this.notificatoinsForm.valueChanges
      .pipe(
        takeWhile(() => this.alive),
        tap((changes: Dtos.INotificationSettingsDto) => {
          if (changes.sendPushes) this.pushService.ensurePushPermission();
          // FIXME merge change events (in backend) that are close together in time
        }),
      )
      .subscribe();
  }

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

  private updateNotificationForm = () =>
    this.store
      .select(NotificationsSelectors.selectNotificationsState)
      .pipe(
        tap(state => {
          const patch = {
            sendEmails: state.settings.sendEmails,
            sendPushes: state.settings.sendPushes,
          };
          this.notificatoinsForm.patchValue(patch);
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
