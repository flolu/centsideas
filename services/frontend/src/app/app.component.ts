import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '.';
import { UsersSelectors } from './users';

@Component({
  selector: 'ci-root',
  template: `
    <nav>
      <a class="icon" [routerLink]="['']"><span>💡</span></a>
      <div style="width: 100%;"></div>
      <a [routerLink]="['/login']" class="icon"><span>👤</span></a>
      <h3 class="user" *ngIf="user$ | async">{{ (user$ | async)?.username }}</h3>
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
        margin: 10px;
      }
    `,
  ],
})
export class AppComponent {
  user$ = this.store.select(UsersSelectors.selectUser);

  constructor(private store: Store<AppState>) {}
}
