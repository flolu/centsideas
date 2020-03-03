import { Component } from '@angular/core';

@Component({
  selector: 'app-component',
  template: `
    <mat-drawer-container>
      <mat-drawer #drawer [opened]="true" mode="side">
        <mat-nav-list>
          <a mat-list-item routerLink="/"> Home </a>
          <a mat-list-item routerLink="/hello"> Hello World </a>
          <a mat-list-item routerLink="/todos"> Todos </a>
        </mat-nav-list>
      </mat-drawer>

      <mat-drawer-content>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
  `,
})
export class AppComponent {}
