import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule } from 'ngx-socket-io';

import { ENVIRONMENT, environment } from '@cia/environment';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'admin-client' }),
    HttpClientModule,
    SocketIoModule.forRoot({ url: environment.adminSocketUrl, options: {} }),
  ],
  declarations: [AppComponent],
  providers: [{ provide: ENVIRONMENT, useValue: environment }],
})
export class AppBaseModule {}
