import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromIdeas from './ideas.reducer';
import * as fromEditIdeas from './edit-idea.reducer';
import { IdeasEffects } from './ideas.effects';
import { IdeasService } from './ideas.service';
import { FeatureKeys } from '../app.selectors';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(FeatureKeys.Ideas, {
      ideas: fromIdeas.reducer,
      edit: fromEditIdeas.reducer,
    }),
    EffectsModule.forFeature([IdeasEffects]),
  ],
  providers: [IdeasEffects, IdeasService],
})
export class IdeasStoreModule {}
