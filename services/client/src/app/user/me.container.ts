import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { QueryParamKeys } from '@cents-ideas/enums';
import { IUserState } from '@cents-ideas/models';

import { UserSelectors } from './user.selectors';
import { UserActions } from './user.actions';

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
export class MeContainer {
  user: IUserState;

  form = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
  });

  constructor(private store: Store, private route: ActivatedRoute) {
    // TODO fetch from router store
    const changeEmailToken = this.route.snapshot.queryParams[
      QueryParamKeys.ConfirmEmailChangeToken
    ];
    if (changeEmailToken) {
      this.store.dispatch(UserActions.confirmEmailChange({ token: changeEmailToken }));
    }
    this.store
      .select(UserSelectors.selectUserState)
      .pipe(
        tap(state => {
          this.form.patchValue(state.user);
          this.user = state.user;
        }),
      )
      .subscribe();
  }

  onUpdate = () => {
    this.store.dispatch(
      UserActions.updateUser({
        email: this.form.value.email,
        username: this.form.value.username,
      }),
    );
  };
}
