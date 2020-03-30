import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import * as ideas from '@ci-frontend/ideas/ideas.reducer';
import * as reviews from '@ci-frontend/reviews/reviews.reducer';
import * as users from '@ci-frontend/users/users.reducer';
import { IdeasEffects } from '@ci-frontend/ideas/ideas.effects';

import { environment } from 'src/environments/environment';
import { ReviewsEffects } from './reviews/reviews.effects';
import { UsersEffects } from './users/users.effects';

@NgModule({
  imports: [
    StoreModule.forRoot({
      ideas: ideas.reducer,
      reviews: reviews.reducer,
      users: users.reducer,
    }),
    EffectsModule.forRoot([IdeasEffects, ReviewsEffects, UsersEffects]),
    environment.production ? [] : StoreDevtoolsModule.instrument(),
  ],
})
export class AppStoreModule {}
