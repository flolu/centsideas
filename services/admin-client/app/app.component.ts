import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';

import { IEvent } from '@centsideas/models';
import { ENVIRONMENT, IAdminClientEnvironment } from '@cia/environment';
import { ApiEndpoints, AdminApiRoutes, ErrorEvents } from '@centsideas/enums';

@Component({
  selector: 'cia-root',
  template: `
    <h1>Admin Panel</h1>
    <h2>Events</h2>
    <div
      *ngFor="let event of events"
      class="event"
      [class.error]="isError(event)"
      [class.unexpected_error]="isUnexpectedError(event)"
    >
      <h3 class="name">{{ event?.name }}</h3>
      <pre>{{ event?.data | json }}</pre>
    </div>
  `,
  styleUrls: ['app.component.sass'],
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

  isError(event: IEvent) {
    return event.name === ErrorEvents.ErrorOccurred;
  }

  isUnexpectedError(event: IEvent) {
    return event.name === ErrorEvents.ErrorOccurred && event.data.unexpected;
  }
}
