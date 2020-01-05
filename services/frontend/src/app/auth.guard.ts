import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

import { AppState } from '.';
import { UsersSelectors } from './users';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(UsersSelectors.selectUser).pipe(
      map(user => {
        if (!user) {
          this.router.navigate([environment.routing.auth.login.name]);
        }
        return !!user;
      }),
    );
  }
}
