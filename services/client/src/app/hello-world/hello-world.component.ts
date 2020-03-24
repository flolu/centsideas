import { Component } from '@angular/core';
import { format } from 'date-fns';

function shorten(s: string, length: number) {
  if (s.length < length) return s;
  return s.substr(0, length - 3) + '...';
}

@Component({
  selector: 'hello-world',
  template: `
    <div id="greeting">Hello {{ name }}</div>
    <p>Today is {{ date }}</p>
    <div class="mood-icon">mood icon</div>
  `,
})
export class HelloWorldComponent {
  name: string = shorten('Adolph Blaine Wolfeschlegelsteinhausenbergerdorff, Senior ', 15);
  date: string = format(new Date(), 'MMMM D, YYYY');
}
