import { Component, OnDestroy } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { tap, take, takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';

import { QueryParamKeys } from '@cents-ideas/enums';
import { IUserState } from '@cents-ideas/models';

import { UserSelectors } from './user.selectors';
import { UserActions } from './user.actions';

const selectChangeEmailToken = createSelector(
  createFeatureSelector<any>('router'),
  router => router.state.queryParams[QueryParamKeys.ConfirmEmailChangeToken],
);

@Component({
  selector: 'ci-me',
  template: `
    <h1>Me</h1>
    <form [formGroup]="form">
      <label for="username">
        Username
      </label>
      <br />
      <input name="username" type="text" formControlName="username" />
      <br />
      <br />
      <label for="email">
        Email
      </label>
      <br />
      <input name="email" type="text" formControlName="email" />
      <br />
      <span>pending email: {{ user?.pendingEmail }}</span>
      <br />
      <br />
      <button (click)="onUpdate()">Update</button>
    </form>
  `,
})
export class MeContainer implements OnDestroy {
  user: IUserState;
  alive = true;

  form = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
  });

  constructor(private store: Store, private router: Router) {
    this.handleConfirmEmailChange();
    this.updateUserForm();
  }

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

  ngOnDestroy() {
    this.alive = false;
  }
}
