import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthActions } from './auth.actions';
import { QueryParamKeys } from '@cents-ideas/enums';

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
export class LoginContainer implements OnInit {
  form = new FormGroup({
    email: new FormControl(''),
  });

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams[QueryParamKeys.Token];
    if (token) {
      this.store.dispatch(AuthActions.confirmLogin({ token }));
      this.router.navigate([], { queryParams: { token: null }, queryParamsHandling: 'merge' });
    }
  }

  onLogin = () => {
    this.store.dispatch(AuthActions.login({ email: this.form.value.email }));
  };
}
