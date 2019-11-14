import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IdeasService } from './ideas.service';
import { IdeasEffects } from './ideas.effects';
import { IdeasContainers } from './containers';
import { IdeasComponents } from './components';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [...IdeasContainers, ...IdeasComponents],
  providers: [IdeasService, IdeasEffects],
})
export class IdeasModule {}
