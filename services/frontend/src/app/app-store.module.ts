import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import * as ideas from '@ci-frontend/ideas/ideas.reducer';
import { IdeasEffects } from '@ci-frontend/ideas/ideas.effects';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    StoreModule.forRoot({ ideas: ideas.reducer }),
    EffectsModule.forRoot([IdeasEffects]),
    environment.production ? [] : StoreDevtoolsModule.instrument(),
  ],
})
export class AppStoreModule {}
