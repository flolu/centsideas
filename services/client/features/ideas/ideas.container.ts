import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { IIdeaViewModel } from '@centsideas/models';
import { Router } from '@angular/router';
import { TopLevelFrontendRoutes } from '@centsideas/enums';
import { IdeasSelectors, IdeasActions, CreateIdeaActions, IIdeaForm } from './store';

@Component({
  selector: 'cic-ideas',
  template: `
    <div class="container">
      <div *ngIf="(state$ | async)?.loading">Loading...</div>
      <cic-ideas-create
        *ngIf="createIdeaState$ | async as state"
        [status]="state.status"
        [formState]="state.persisted"
        (create)="onCreateIdea($event)"
      ></cic-ideas-create>
      <h1>All Ideas</h1>
      <cic-ideas-card
        *ngFor="let i of ideas$ | async"
        [idea]="i"
        (clickedTitle)="onIdeaTitleClicked(i)"
      ></cic-ideas-card>
      <div *ngIf="!(ideas$ | async)?.length">No ideas found</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdeasContainer {
  ideas$ = this.store.select(IdeasSelectors.ideas);
  state$ = this.store.select(IdeasSelectors.ideasState);
  createIdeaState$ = this.store.select(IdeasSelectors.createIdeaState);

  constructor(private store: Store, private router: Router) {
    this.store.dispatch(IdeasActions.getIdeas());
  }

  onIdeaTitleClicked(idea: IIdeaViewModel) {
    this.router.navigate([TopLevelFrontendRoutes.Ideas, idea.id]);
  }

  onCreateIdea({ title, description }: IIdeaForm) {
    this.store.dispatch(CreateIdeaActions.createIdea({ title, description }));
  }
}
