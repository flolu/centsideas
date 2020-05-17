import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppBaseModule} from './app-base.module';

@NgModule({
  imports: [AppBaseModule],
  bootstrap: [AppComponent],
})
export class AppProdModule {}
