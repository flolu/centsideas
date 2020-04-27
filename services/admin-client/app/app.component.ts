import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

import { IEvent } from '@centsideas/models';
import { ENVIRONMENT, IAdminClientEnvironment } from '@cia/environment';
import { ApiEndpoints, AdminApiRoutes } from '@centsideas/enums';

@Component({
  selector: 'cia-root',
  template: `
    <h1>Admin Panel</h1>
    <h2>Events</h2>
    <div class="events">
      <div *ngFor="let event of events">
        <pre>{{ event | json }}</pre>
      </div>
    </div>
  `,
  styles: [
    `
      .events {
        overflow: scroll;
      }
    `,
  ],
})
export class AppComponent {
  events: IEvent[] = [];

  constructor(
    private socket: Socket,
    @Inject(ENVIRONMENT) private env: IAdminClientEnvironment,
    private http: HttpClient,
  ) {
    this.http
      .get<IEvent[]>(`${this.env.gatewayUrl}/${ApiEndpoints.Admin}/${AdminApiRoutes.Events}`)
      .subscribe(events => {
        this.events = events;
        this.socket.on('event', event => (this.events = [JSON.parse(event), ...this.events]));
      });
  }
}
