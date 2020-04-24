import { Component, Inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { ENVIRONMENT, IAdminClientEnvironment } from './environment';

@Component({ selector: 'cia-root', template: ` <h1>Admin Panel</h1> ` })
export class AppComponent {
  constructor(private socket: Socket, @Inject(ENVIRONMENT) private env: IAdminClientEnvironment) {
    this.socket.emit(
      'message',
      'hello from frontend with environment: ' + JSON.stringify(this.env),
    );
    // tslint:disable-next-line
    this.socket.on('message', msg => console.log('message from backend: ', msg));
  }
}
