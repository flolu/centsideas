import { Component } from '@angular/core';
import { format } from 'date-fns';

@Component({
  selector: 'hello-world',
  template: `
    <h1>Home</h1>
    <mat-card>
      <mat-card-content>
        <p>Today is {{ date }}</p>
      </mat-card-content>

      <mat-card-footer>
        <div class="mood-icon"><mat-icon>mood</mat-icon></div>
      </mat-card-footer>
    </mat-card>
  `,
})
export class HelloWorldComponent {
  date: string = format(new Date(), 'MMMM D, YYYY');
}
