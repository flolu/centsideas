import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IdeasContainers } from './containers';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [...IdeasContainers],
})
export class IdeasModule {}
