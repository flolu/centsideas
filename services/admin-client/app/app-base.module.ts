import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule } from 'ngx-socket-io';

import { ENVIRONMENT, environment } from '@cia/environment';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, SocketIoModule.forRoot({ url: environment.gatewayHost, options: {} })],
  declarations: [AppComponent],
  providers: [{ provide: ENVIRONMENT, useValue: environment }],
})
export class AppBaseModule {}
