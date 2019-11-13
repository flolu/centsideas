import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { SettingsService } from './settings.service';
import { IdeasModule } from './ideas/ideas.module';
import { IdeasContainer, IdeaContainer } from './ideas/containers';
import { IdeasEffects } from './ideas/ideas.effects';

import * as fromIdeas from './ideas/ideas.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    StoreModule.forRoot({ ideas: fromIdeas.reducer }),
    EffectsModule.forRoot([IdeasEffects]),
    environment.production ? [] : StoreDevtoolsModule.instrument(),
    IdeasModule,
    // TODO use global constant for 'ideas' string
    RouterModule.forRoot([
      { path: '', redirectTo: 'ideas', pathMatch: 'full' },
      { path: 'ideas', component: IdeasContainer },
      { path: 'ideas/:id', component: IdeaContainer },
      { path: '**', redirectTo: 'ideas', pathMatch: 'full' },
    ]),
  ],
  providers: [
    SettingsService,
    {
      provide: APP_INITIALIZER,
      useFactory: (settingsHttpService: SettingsService) => () => settingsHttpService.initializeApp(),
      deps: [SettingsService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
