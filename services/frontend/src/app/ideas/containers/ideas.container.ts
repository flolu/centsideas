import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IIdeaViewModel } from '@cents-ideas/models';

import { AppState } from '../../app.state';
import { selectIdeas, selectLoading } from '../ideas.selectors';
import { getIdeas, createIdea } from '../ideas.actions';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

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
  ideas$ = this.store.select(selectIdeas);
  loading$ = this.store.select(selectLoading);

  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });

  constructor(private store: Store<AppState>, private router: Router) {
    this.store.dispatch(getIdeas());
  }

  onIdeaTitleClicked = (idea: IIdeaViewModel): void => {
    // TODO use global constant for 'ideas' string
    this.router.navigate(['ideas', idea.id]);
  };

  onCreate = (): void => {
    this.store.dispatch(createIdea({ title: this.form.value.title, description: this.form.value.description }));
    this.form.reset();
  };
}
