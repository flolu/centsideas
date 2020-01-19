import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { map, skipWhile } from 'rxjs/operators';

import { AppState, AppSelectors } from '.';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(AppSelectors.selectUsersState).pipe(
      // FIXME skip while not initialized
      skipWhile(state => state.loading),
      map(state => {
        if (!state.user) {
          console.log('[AuthGuard] not authenticated', state);
          this.router.navigate([environment.routing.auth.login.name]);
        }
        return !!(state.user && state.user.id);
      }),
    );
  }
}
