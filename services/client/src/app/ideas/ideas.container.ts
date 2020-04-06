import * as __rxjsTypes from 'rxjs';

import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';

import { IdeasActions } from './ideas.actions';
import { IdeasSelectors } from './ideas.selectors';

@Component({
  selector: 'ci-ideas',
  template: `
    <div class="container">
      <div *ngIf="(state$ | async)?.loading">Loading...</div>
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
      <!--<ci-ideas-card
        *ngFor="let i of ideas$ | async"
        [idea]="i"
        (clickedTitle)="onIdeaTitleClicked(i)"
      ></ci-ideas-card>-->
      <div *ngIf="!(ideas$ | async)?.length">No ideas found</div>
    </div>
  `,
})
export class IdeasContainer {
  ideas$ = this.store.select(IdeasSelectors.selectIdeas);
  state$ = this.store.select(IdeasSelectors.selectIdeasState);

  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });

  constructor(private store: Store) {}

  onCreate = () => {
    this.store.dispatch(
      IdeasActions.createIdea({
        title: this.form.value.title,
        description: this.form.value.description,
      }),
    );
  };
}
