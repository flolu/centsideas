import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { take, tap } from 'rxjs/operators';

import { AppState } from '@ci-frontend/app';
import { IdeasSelectors, IdeasActions } from '..';

@Component({
  selector: 'ci-idea',
  template: `
    <div class="container">
      <ci-ideas-card *ngIf="idea$ | async" [idea]="idea$ | async"></ci-ideas-card>
      <p>{{ (idea$ | async)?.description }}</p>
      <p>Posted by: {{ (idea$ | async)?.userId }}</p>
      <p>Published at: {{ (idea$ | async)?.createdAt | date }}</p>
      <ci-reviews [reviews]="(idea$ | async)?.reviews"></ci-reviews>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 10px;
        max-width: 1000px;
        margin: 0 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdeaContainer {
  ideaId: string = this.route.snapshot.params.id;
  idea$ = this.store.select(IdeasSelectors.selectIdea(this.ideaId));

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {
    this.idea$
      .pipe(
        take(1),
        tap(idea => {
          this.store.dispatch(IdeasActions.getIdeaById({ id: this.ideaId }));
          if (!idea) {
          }
        }),
      )
      .subscribe();
  }
}
