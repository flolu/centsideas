import { Component } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { QueryParamKeys } from '@cents-ideas/enums';

import { AuthActions } from './auth.actions';
import { tap, take } from 'rxjs/operators';

const selectAuthToken = createSelector(
  createFeatureSelector<any>('router'),
  router => router.state.queryParams[QueryParamKeys.Token],
);

@Component({
  selector: 'ci-login',
  template: `
    <h1>Login</h1>
    <form [formGroup]="form">
      <label for="email">Email</label>
      <br />
      <input name="email" type="text" formControlName="email" />
      <br />
      <button (click)="onLogin()">Login</button>
    </form>
  `,
})
export class LoginContainer {
  form = new FormGroup({
    email: new FormControl(''),
  });

  constructor(private store: Store, private router: Router) {
    this.handleConfirmLogin();
  }

  onLogin = () => {
    this.store.dispatch(AuthActions.login({ email: this.form.value.email }));
  };

  handleConfirmLogin = () => {
    this.store
      .select(selectAuthToken)
      .pipe(
        tap(token => {
          if (token) {
            this.store.dispatch(AuthActions.confirmLogin({ token }));
            this.router.navigate([], {
              queryParams: { [QueryParamKeys.Token]: null },
              queryParamsHandling: 'merge',
            });
          }
        }),
        take(1),
      )
      .subscribe();
  };
}
