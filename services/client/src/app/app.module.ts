import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppStoreModule } from './app-store.module';
import { IdeasModule } from './ideas/ideas.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'client' }),
    AppRoutingModule,
    AppStoreModule,
    IdeasModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
