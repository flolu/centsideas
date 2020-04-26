import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { tap, take } from 'rxjs/operators';

import { QueryParamKeys, TopLevelFrontendRoutes } from '@centsideas/enums';
import { AuthActions, RouterSelectors } from '@cic/store';

@Component({
  selector: 'cic-login',
  template: `
    <h1>Login</h1>
    <form [formGroup]="form">
      <label for="email">Email</label>
      <br />
      <input id="email" type="text" formControlName="email" />
      <br />
      <button (click)="onLogin()">Login</button>
    </form>
    <button (click)="onLoginWithGoogle()">Login with Google</button>
  `,
})
export class LoginContainer {
  form = new FormGroup({
    email: new FormControl(''),
  });

  constructor(private store: Store, private router: Router) {
    this.handleConfirmLogin();
    this.handleGoogleSignIn();
  }

  onLogin = () => this.store.dispatch(AuthActions.login({ email: this.form.value.email }));
  onLoginWithGoogle = () => this.store.dispatch(AuthActions.googleLoginRedirect());

  handleConfirmLogin = () => {
    this.store
      .select(RouterSelectors.queryParam(QueryParamKeys.Token))
      .pipe(
        tap(token => {
          if (token) this.store.dispatch(AuthActions.confirmLogin({ token }));
          this.router.navigate([TopLevelFrontendRoutes.Login]);
        }),
        take(1),
      )
      .subscribe();
  };

  handleGoogleSignIn = () => {
    this.store
      .select(RouterSelectors.queryParam(QueryParamKeys.GoogleSignInCode))
      .pipe(
        tap(code => {
          if (code) this.store.dispatch(AuthActions.googleLogin({ code }));
          this.router.navigate([TopLevelFrontendRoutes.Login]);
        }),
        take(1),
      )
      .subscribe();
  };
}
