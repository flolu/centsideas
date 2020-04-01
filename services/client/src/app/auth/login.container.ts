import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ci-login',
  template: `<h1>Login</h1>`,
})
export class LoginContainer {
  constructor(private store: Store) {}
}
