import * as __rxjsTypes from 'rxjs';
import * as __ngrxStore from '@ngrx/store/store';

import { Component, OnDestroy } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { tap, take, takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';

import { QueryParamKeys } from '@centsideas/enums';
import { IUserState, Dtos } from '@centsideas/models';

import { UserSelectors } from './user.selectors';
import { UserActions } from './user.actions';
import { AuthActions } from '../auth/auth.actions';
import { NotificationsActions } from './notifications/notifications.actions';
import { EnvironmentService } from '../../shared/environment/environment.service';
import { NotificationsSelectors } from './notifications/notifications.selectors';

const selectChangeEmailToken = createSelector(
  createFeatureSelector<any>('router'),
  router => router.state.queryParams[QueryParamKeys.ConfirmEmailChangeToken],
);

// FIXME live indicator of username and email availability
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
      <ng-container *ngIf="notificationsState$ | async as nState">
        <span *ngIf="nState.loading">Updating...</span>
        <span *ngIf="nState.loaded && !nState.loading">Saved settings</span>
      </ng-container>
    </form>
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
    sendEmails: new FormControl(false),
    sendPushes: new FormControl(false),
  });

  constructor(
    private store: Store,
    private router: Router,
    private swPush: SwPush,
    private envService: EnvironmentService,
  ) {
    this.handleConfirmEmailChange();
    this.updateUserForm();
    this.listenNotificationForm();
  }

  onLogout = () => this.store.dispatch(AuthActions.logout());

  onUpdate = () => {
    this.store.dispatch(
      UserActions.updateUser({
        email: this.form.value.email,
        username: this.form.value.username,
      }),
    );
  };

  updateUserForm = () => {
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
  };

  handleConfirmEmailChange = () => {
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
  };

  async askForPushPermission() {
    if (!this.swPush.isEnabled) {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.envService.env.vapidPublicKey,
      });
      this.store.dispatch(NotificationsActions.addPushSub({ subscription: sub }));
    }
  }

  private listenNotificationForm() {
    this.notificatoinsForm.valueChanges
      .pipe(
        takeWhile(() => this.alive),
        tap((changes: Dtos.INotificationSettingsDto) => {
          this.store.dispatch(NotificationsActions.updateSettings({ settings: changes }));
          if (changes.sendPushes) this.askForPushPermission();
          // FIXME merge change events (in backend) that are close together in time
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
