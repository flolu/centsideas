import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppProdModule } from './app-prod.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [ServerModule, ServerTransferStateModule, AppProdModule],
  bootstrap: [AppComponent],
})
export class AppProdServerModule {}
