import { Component } from '@angular/core';
import { format } from 'date-fns';

@Component({
  selector: 'hello-world',
  template: `
    <h1>Home</h1>
    <p>Today is {{ date }}</p>
  `,
})
export class HelloWorldComponent {
  date: string = format(new Date(), 'MMMM D, YYYY');
}
