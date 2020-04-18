import * as __rxjsTypes from 'rxjs';
import * as __ngrxStore from '@ngrx/store/store';

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { IdeasSelectors } from './ideas.selectors';
import { IdeasActions } from './ideas.actions';
import { IIdeaForm } from './ideas.state';

@Component({
  selector: 'ci-idea',
  template: `
    <h1 *ngIf="(idea$ | async)?.deleted">
      You have deleted this idea at {{ (idea$ | async)?.deletedAt | date }}
    </h1>
    <ng-container *ngIf="!(editState$ | async)?.editing">
      <button *ngIf="isOwner$ | async" (click)="onEdit()">Edit</button>
      <ci-ideas-card *ngIf="idea$ | async" [idea]="idea$ | async"></ci-ideas-card>
      <p>{{ (idea$ | async)?.description }}</p>
      <p>Posted by: {{ (idea$ | async)?.userId }}</p>
      <p>Published at: {{ (idea$ | async)?.createdAt | date }}</p>
      <!--<ci-reviews [reviews]="(idea$ | async)?.reviews"></ci-reviews>-->
    </ng-container>
    <ci-edit-idea
      *ngIf="(editState$ | async)?.editing"
      [formState]="(editState$ | async)?.form"
      (updateForm)="onUpdateForm($event)"
      (cancel)="onCancelEdit()"
      (save)="onSaveEdit()"
      (delete)="onDelete()"
    >
    </ci-edit-idea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdeaContainer {
  idea$ = this.store.select(IdeasSelectors.selectSelectedIdea);
  editState$ = this.store.select(IdeasSelectors.selectEditIdeaState);
  isOwner$ = this.store.select(IdeasSelectors.selectIsCurrentUserOwner);

  constructor(private store: Store) {}

  onUpdateForm = (value: IIdeaForm) => this.store.dispatch(IdeasActions.ideaFormChanged({ value }));
  onEdit = () => this.store.dispatch(IdeasActions.editIdea());
  onSaveEdit = () => this.store.dispatch(IdeasActions.updateIdea());
  onCancelEdit = () => this.store.dispatch(IdeasActions.cancelEditIdea());
  onDelete = () => this.store.dispatch(IdeasActions.deleteIdea());
}
