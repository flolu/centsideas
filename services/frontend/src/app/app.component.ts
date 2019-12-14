import { Component } from '@angular/core';

@Component({
  selector: 'ci-root',
  template: `
    <nav>
      <a class="icon" [routerLink]="['']"><span>💡</span></a>
      <div style="width: 100%;"></div>
      <a class="icon"><span>👤</span></a>
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
    `,
  ],
})
export class AppComponent {}
