import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IdeasModule } from './ideas/ideas.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'client' }),
    StoreModule.forRoot({}),
    // TODO only in dev mode
    StoreDevtoolsModule.instrument(),
    AppRoutingModule,
    IdeasModule,
    AuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
