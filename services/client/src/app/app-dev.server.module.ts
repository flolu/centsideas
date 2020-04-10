import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppDevModule } from './app-dev.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [ServerModule, ServerTransferStateModule, AppDevModule],
  bootstrap: [AppComponent],
})
export class AppDevServerModule {}
