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
    <div class="container">
      <div *ngIf="loading$ | async">Loading...</div>
      <h1>Create Idea</h1>
      <form [formGroup]="form">
        <label for="title">
          Title
        </label>
        <br />
        <input name="title" type="text" formControlName="title" />
        <br />
        <label for="description">
          Description
        </label>
        <br />
        <input name="description" type="text" formControlName="description" />
        <br />
        <button (click)="onCreate()">Create</button>
      </form>
      <h1>All Ideas</h1>
      <ci-ideas-card *ngFor="let i of ideas$ | async" [idea]="i" (clickedTitle)="onIdeaTitleClicked(i)"></ci-ideas-card>
      <div *ngIf="!(ideas$ | async)?.length">No ideas found</div>
    </div>
  `,
  styles: [
    `
      .container {
        margin: 10px;
        max-width: 1000px;
        margin: 0 auto;
      }
    `,
  ],
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
