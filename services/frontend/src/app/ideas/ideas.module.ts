import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { containers } from './containers';
import { components } from './components';
import { IdeasService } from './ideas.service';
import { IdeasEffects } from './ideas.effects';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [...containers, ...components],
  providers: [IdeasService, IdeasEffects],
})
export class IdeasModule {}
