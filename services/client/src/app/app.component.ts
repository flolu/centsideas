import { Component } from '@angular/core';

@Component({
  selector: 'app-component',
  template: `
    <h1>Client Angular App</h1>
    <h2>app-component</h2>
  `,
  styles: [
    `
      h2 {
        color: purple;
      }
    `,
  ],
})
export class AppComponent {
  title = 'client';
}
