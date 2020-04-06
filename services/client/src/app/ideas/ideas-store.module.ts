import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromIdeas from '../ideas/ideas.reducer';
import { featureKey } from './ideas.state';
import { IdeasEffects } from './ideas.effects';
import { IdeasService } from './ideas.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(featureKey, { ideas: fromIdeas.reducer }),
    EffectsModule.forFeature([IdeasEffects]),
  ],
  providers: [IdeasEffects, IdeasService],
})
export class IdeasStoreModule {}
