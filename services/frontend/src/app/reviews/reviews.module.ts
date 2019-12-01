import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// import { ReviewsService } from './reviews.service';
// import { ReviewsEffects } from './reviews.effects';
import { ReviewsContainers } from './containers';
import { ReviewsComponents } from './components';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [...ReviewsContainers, ...ReviewsComponents],
  exports: [...ReviewsContainers],
  // providers: [ReviewsService, ReviewsEffects],
})
export class ReviewsModule {}
