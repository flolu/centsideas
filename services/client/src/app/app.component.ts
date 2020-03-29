import { Component } from '@angular/core';

import { CentsCommandments } from '@cents-ideas/enums';

@Component({
  selector: 'app-component',
  template: `
    <p>CENTS: {{ cents }}</p>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  cents = `${CentsCommandments.Control}, ${CentsCommandments.Entry}, ${CentsCommandments.Need}, ${CentsCommandments.Time}, ${CentsCommandments.Scale}`;
}
