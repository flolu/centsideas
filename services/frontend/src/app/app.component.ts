import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '.';
import { UsersSelectors, UsersActions } from './users';
import { UsersService } from './users/users.service';

@Component({
  selector: 'ci-root',
  template: `
    <nav>
      <a class="icon" [routerLink]="['']"><span>💡</span></a>
      <div style="width: 100%;"></div>
      <h3 class="user" *ngIf="user$ | async">
        {{ (user$ | async)?.username }}
      </h3>
      <a *ngIf="!(user$ | async)?.id" [routerLink]="['/login']" class="icon"><span>👤</span></a>
      <a *ngIf="(user$ | async)?.id" [routerLink]="['/user']" class="icon"><span>👤</span></a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      nav {
        background: #f4f4f4;
        border-bottom: 2px solid lightgrey;
        width: 100%;
        display: flex;
        flex-direction: row;
      }
      .icon {
        margin: 10px;
        font-size: 1.5em;
        text-decoration: none;
      }
      .user {
        margin: 10px;token
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  user$ = this.store.select(UsersSelectors.selectUser);

  constructor(private store: Store<AppState>, private usersService: UsersService) {}

  ngOnInit() {
    if (this.usersService.token) {
      this.store.dispatch(UsersActions.authenticate());
    }
  }
}
