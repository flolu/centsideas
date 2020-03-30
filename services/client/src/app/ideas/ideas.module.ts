import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IdeasContainers, IdeasContainer, IdeaContainer } from './containers';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: IdeasContainer },
      { path: ':id', component: IdeaContainer },
    ]),
  ],
  declarations: [...IdeasContainers],
})
export class IdeasModule {}
