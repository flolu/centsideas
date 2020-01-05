import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { tap, take, takeWhile } from 'rxjs/operators';

import { IUserState } from '@cents-ideas/models';

import { AppState } from '@ci-frontend/app';
import { UsersSelectors } from '..';

@Component({
  selector: 'ci-user',
  template: `
    <div class="container">
      <h1>User</h1>
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
export class UserContainer {
  // TODO not logged in guard

  form = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
  });

  constructor(private store: Store<AppState>) {
    this.store
      .select(UsersSelectors.selectUser)
      .pipe(
        tap(user => {
          if (user) {
            this.form.patchValue({ username: user.username, email: user.email });
          }
        }),
        takeWhile(user => !user),
      )
      .subscribe();
  }

  onUpdate = () => {};
}
