import { Component } from '@angular/core';

import { CentsCommandments } from '@cents-ideas/enums';
import { Store } from '@ngrx/store';
import { AuthActions } from './user/auth.actions';
import { UserService } from './user/user.service';

@Component({
  selector: 'ci-component',
  template: `
    <p>CENTS: {{ cents }}</p>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  cents = `${CentsCommandments.Control}, ${CentsCommandments.Entry}, ${CentsCommandments.Need}, ${CentsCommandments.Time}, ${CentsCommandments.Scale}`;

  constructor(private store: Store<any>, private userService: UserService) {
    this.store.dispatch(AuthActions.authenticate());
  }
}
