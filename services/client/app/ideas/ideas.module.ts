import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IdeasContainer } from './ideas.container';
import { IdeaContainer } from './idea.container';
import { IdeasStoreModule } from './ideas-store.module';
import { IdeaCardComponent } from './idea-card.component';
import { IdeaLoadedGuard } from './idea-loaded.guard';
import { EditIdeaComponent } from './edit-idea.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IdeasStoreModule,
    RouterModule.forChild([
      { path: '', component: IdeasContainer },
      { path: ':id', component: IdeaContainer, canActivate: [IdeaLoadedGuard] },
    ]),
  ],
  declarations: [IdeasContainer, IdeaContainer, IdeaCardComponent, EditIdeaComponent],
  providers: [IdeaLoadedGuard],
})
export class IdeasModule {}
