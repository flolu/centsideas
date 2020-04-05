import { Component } from '@angular/core';
import { CentsCommandments } from '@cents-ideas/enums';
import { Store } from '@ngrx/store';
import { AuthActions } from './user/auth.actions';
import { UserSelectors } from './user/user.selectors';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'ci-component',
  template: `
    <p>CENTS: {{ cents }}</p>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  cents = `${CentsCommandments.Control}, ${CentsCommandments.Entry}, ${CentsCommandments.Need}, ${CentsCommandments.Time}, ${CentsCommandments.Scale}`;

  constructor(private store: Store) {
    this.handleAuthentication();
  }

  handleAuthentication = () => {
    this.store
      .select(UserSelectors.selectAuthState)
      .pipe(
        take(1),
        tap(state => {
          if (state.authenticationTryCount < 1) {
            this.store.dispatch(AuthActions.authenticate());
          }
        }),
      )
      .subscribe();
  };
}
