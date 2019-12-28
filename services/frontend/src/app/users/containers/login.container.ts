import { FormControl, FormGroup } from '@angular/forms';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '@ci-frontend/app';

import { UsersActions, UsersSelectors } from '..';

@Component({
  selector: 'ci-login',
  template: `
    <div class="container">
      <h1>Login</h1>
      <form [formGroup]="form">
        <label for="email">
          Email
        </label>
        <br />
        <input name="email" type="text" formControlName="email" />
        <br />
        <button (click)="onLogin()">Login</button>
      </form>
      <div *ngIf="loading$ | async">Loading</div>
      <ng-container *ngIf="loaded$ | async">
        <h3>We've sent you an email to confirm your login/sign up</h3>
        <!-- // TODO remove this url -->
        <a href="{{ activationRoute$ | async }}">Confirm</a>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 10px;
        max-width: 1000px;
        margin: 0 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginContainer {
  loading$ = this.store.select(UsersSelectors.selectLoading);
  loaded$ = this.store.select(UsersSelectors.selectLoaded);
  token$ = this.store.select(UsersSelectors.selectToken);
  activationRoute$ = this.store.select(UsersSelectors.selectFullActivationRoute);

  form = new FormGroup({
    email: new FormControl(''),
  });

  constructor(private store: Store<AppState>) {}

  onLogin = () => {
    this.store.dispatch(UsersActions.login({ email: this.form.value.email }));
  };
}
