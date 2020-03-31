import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { IdeasContainer } from './ideas.container';
import { IdeaContainer } from './idea.container';
import * as fromReducer from './ideas.reducer';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: IdeasContainer },
      { path: ':id', component: IdeaContainer },
    ]),
    StoreModule.forFeature('ideas', { ideas: fromReducer.reducer }),
  ],
  declarations: [IdeasContainer, IdeaContainer],
})
export class IdeasModule {}
