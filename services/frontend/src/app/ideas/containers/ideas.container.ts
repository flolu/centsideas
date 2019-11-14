import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { IIdeaViewModel } from '@cents-ideas/models';
import { AppState } from '@ci-frontend/app';
import { IdeasSelectors, IdeasActions } from '@ci-frontend/ideas';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ci-ideas',
  template: `
    <div *ngIf="loading$ | async">Loading...</div>
    <h1>Create Idea</h1>
    <form [formGroup]="form">
      <label>
        Title:
        <input type="text" formControlName="title" />
      </label>
      <br />
      <label>
        Description:
        <input type="text" formControlName="description" />
      </label>
      <button (click)="onCreate()">Create</button>
    </form>
    <h1>All Ideas</h1>
    <ci-ideas-card *ngFor="let i of ideas$ | async" [idea]="i" (clickedTitle)="onIdeaTitleClicked(i)"></ci-ideas-card>
    <div *ngIf="!(ideas$ | async)?.length">No ideas found</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdeasContainer {
  ideas$ = this.store.select(IdeasSelectors.selectIdeas);
  loading$ = this.store.select(IdeasSelectors.selectLoading);

  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });

  constructor(private store: Store<AppState>, private router: Router) {
    this.store.dispatch(IdeasActions.getIdeas());
  }

  onIdeaTitleClicked = (idea: IIdeaViewModel): void => {
    this.router.navigate([environment.routing.ideas.name, idea.id]);
  };

  onCreate = (): void => {
    this.store.dispatch(
      IdeasActions.createIdea({ title: this.form.value.title, description: this.form.value.description }),
    );
    this.form.reset();
  };
}
