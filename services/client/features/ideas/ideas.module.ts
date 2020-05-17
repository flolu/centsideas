import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {IdeasContainer} from './ideas.container';
import {IdeaContainer} from './idea.container';
import {IdeaCardComponent} from './idea-card.component';
import {IdeaLoadedGuard} from './idea-loaded.guard';
import {EditIdeaComponent} from './edit-idea.component';
import {IdeasStoreModule} from './store';
import {CreateIdeaComponent} from './create-idea.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IdeasStoreModule,
    RouterModule.forChild([
      {path: '', component: IdeasContainer},
      {path: ':id', component: IdeaContainer, canActivate: [IdeaLoadedGuard]},
    ]),
  ],
  declarations: [
    IdeasContainer,
    IdeaContainer,
    IdeaCardComponent,
    EditIdeaComponent,
    CreateIdeaComponent,
  ],
  providers: [IdeaLoadedGuard],
})
export class IdeasModule {}
