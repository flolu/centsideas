import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from '@ci-frontend/app';
import { UsersActions } from '..';

@Component({
  selector: 'ci-confirm-sign-up',
  template: `
    <h1>Confirm Sign Up</h1>
  `,
  styles: [``],
})
export class ConfirmSignUpContainer implements OnInit {
  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    this.store.dispatch(UsersActions.confirmSignUp({ token }));
  }
}
