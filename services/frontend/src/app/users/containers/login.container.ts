import { FormControl, FormGroup } from '@angular/forms';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from '@ci-frontend/app';

import { UsersActions, UsersSelectors } from '..';
import { UsersService } from '../users.service';

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
        <h3>We've sent you an email to confirm your login</h3>
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
export class LoginContainer implements OnInit {
  loading$ = this.store.select(UsersSelectors.selectLoading);
  loaded$ = this.store.select(UsersSelectors.selectLoaded);

  form = new FormGroup({
    email: new FormControl(''),
  });

  constructor(private route: ActivatedRoute, private store: Store<AppState>, private usersService: UsersService) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    if (token) {
      this.usersService.saveToken(token);
      this.store.dispatch(UsersActions.authenticate());
    }
  }

  onLogin = () => {
    this.store.dispatch(UsersActions.login({ email: this.form.value.email }));
  };
}
