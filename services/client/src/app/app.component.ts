import { Component } from '@angular/core';

import { CentsCommandments } from '@cents-ideas/enums';

@Component({
  selector: 'app-component',
  template: `
    <h1>Client Angular App</h1>
    <h2>app-component</h2>
    <p>CENTS: {{ cents }}</p>
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
  cents = `${CentsCommandments.Control}, ${CentsCommandments.Entry}, ${CentsCommandments.Need}, ${CentsCommandments.Time}, ${CentsCommandments.Scale}`;
}
