import { Component } from '@angular/core';

@Component({
  selector: 'app-component',
  template: `
    <a routerLink="/"> Home </a>
    <a routerLink="/hello"> Hello World </a>
    <a routerLink="/todos"> Todos </a>

    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}
