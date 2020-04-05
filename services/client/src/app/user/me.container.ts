import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';

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
      <label for="email">
        Email
      </label>
      <br />
      <input name="email" type="text" formControlName="email" />
      <br />
      <button (click)="onUpdate()">Update</button>
    </form>
  `,
})
export class MeContainer {
  form = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
  });

  constructor(private store: Store) {
    this.store
      .select(UserSelectors.selectUserState)
      .pipe(
        tap(state => {
          this.form.patchValue(state.user);
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