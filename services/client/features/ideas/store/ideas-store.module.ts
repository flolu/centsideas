import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { StoreKeys } from '@cic/shared';
import { createIdeaReducer, CreateIdeaEffects } from './create-idea';
import { editIdeaReducer, EditIdeaEffects } from './edit-idea';
import { ideasReducer, IdeasEffects } from './ideas';
import { IdeasService } from './ideas.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(StoreKeys.Ideas, {
      ideas: ideasReducer,
      // FIXME consider lazy loading those reducers through a nested feature module
      create: createIdeaReducer,
      edit: editIdeaReducer,
    }),
    EffectsModule.forFeature([IdeasEffects, CreateIdeaEffects, EditIdeaEffects]),
  ],
  providers: [IdeasEffects, CreateIdeaEffects, EditIdeaEffects, IdeasService],
})
export class IdeasStoreModule {}
