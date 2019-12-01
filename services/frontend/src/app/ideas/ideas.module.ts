import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IdeasService } from './ideas.service';
import { IdeasEffects } from './ideas.effects';
import { IdeasContainers } from './containers';
import { IdeasComponents } from './components';
import { ReviewsModule } from '../reviews/reviews.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ReviewsModule],
  declarations: [...IdeasContainers, ...IdeasComponents],
  providers: [IdeasService, IdeasEffects],
})
export class IdeasModule {}
