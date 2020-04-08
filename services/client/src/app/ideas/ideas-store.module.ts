import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromIdeas from './ideas.reducer';
import * as fromEditIdeas from './edit-idea.reducer';
import { featureKey } from './ideas.state';
import { IdeasEffects } from './ideas.effects';
import { IdeasService } from './ideas.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(featureKey, { ideas: fromIdeas.reducer, edit: fromEditIdeas.reducer }),
    EffectsModule.forFeature([IdeasEffects]),
  ],
  providers: [IdeasEffects, IdeasService],
})
export class IdeasStoreModule {}
