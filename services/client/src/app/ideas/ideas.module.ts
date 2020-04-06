import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IdeasContainer } from './ideas.container';
import { IdeaContainer } from './idea.container';
import { IdeasStoreModule } from './ideas-store.module';
import { IdeaCardComponent } from './idea-card.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: IdeasContainer },
      { path: ':id', component: IdeaContainer },
    ]),
    IdeasStoreModule,
  ],
  declarations: [IdeasContainer, IdeaContainer, IdeaCardComponent],
})
export class IdeasModule {}
