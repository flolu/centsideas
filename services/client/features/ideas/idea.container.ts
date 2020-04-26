import * as __rxjsTypes from 'rxjs';
import * as __ngrxStore from '@ngrx/store/store';

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IdeasSelectors, IIdeaForm, EditIdeaActions } from './store';

@Component({
  selector: 'cic-idea',
  template: `
    <h1 *ngIf="(idea$ | async)?.deleted">
      You have deleted this idea at {{ (idea$ | async)?.deletedAt | date }}
    </h1>
    <ng-container *ngIf="!(editState$ | async)?.editing">
      <button *ngIf="isOwner$ | async" (click)="onEdit()">Edit</button>
      <cic-ideas-card *ngIf="idea$ | async" [idea]="idea$ | async"></cic-ideas-card>
      <p>{{ (idea$ | async)?.description }}</p>
      <p>Posted by: {{ (idea$ | async)?.userId }}</p>
      <p>Published at: {{ (idea$ | async)?.createdAt | date }}</p>
      <!--<cic-reviews [reviews]="(idea$ | async)?.reviews"></cic-reviews>-->
    </ng-container>
    <cic-edit-idea
      *ngIf="(editState$ | async)?.editing"
      [formState]="(editState$ | async)?.form"
      (updateForm)="onUpdateForm($event)"
      (cancel)="onCancelEdit()"
      (save)="onSaveEdit()"
      (delete)="onDelete()"
    >
    </cic-edit-idea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdeaContainer {
  idea$ = this.store.select(IdeasSelectors.selectedIdea);
  editState$ = this.store.select(IdeasSelectors.editIdeaState);
  isOwner$ = this.store.select(IdeasSelectors.isCurrentUserOwner);

  constructor(private store: Store) {}

  onUpdateForm = (value: IIdeaForm) =>
    this.store.dispatch(EditIdeaActions.ideaFormChanged({ value }));
  onEdit = () => this.store.dispatch(EditIdeaActions.editIdea());
  onSaveEdit = () => this.store.dispatch(EditIdeaActions.updateIdea());
  onCancelEdit = () => this.store.dispatch(EditIdeaActions.cancelEditIdea());
  onDelete = () => this.store.dispatch(EditIdeaActions.deleteIdea());
}
