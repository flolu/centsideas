import * as __rxjsTypes from 'rxjs';

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { take, tap } from 'rxjs/operators';

import { IdeasSelectors } from './ideas.selectors';
import { IdeasActions } from './ideas.actions';

@Component({
  selector: 'ci-idea',
  template: `
    <div class="container">
      <ci-ideas-card *ngIf="idea$ | async" [idea]="idea$ | async"></ci-ideas-card>
      <p>{{ (idea$ | async)?.description }}</p>
      <p>Posted by: {{ (idea$ | async)?.userId }}</p>
      <p>Published at: {{ (idea$ | async)?.createdAt | date }}</p>
      <!--<ci-reviews [reviews]="(idea$ | async)?.reviews"></ci-reviews>-->
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdeaContainer {
  // TODO use router store in selector to auto-fetch current idea (+idea-loaded guard)
  ideaId: string = this.route.snapshot.params.id;
  idea$ = this.store.select(IdeasSelectors.selectIdea(this.ideaId));

  constructor(private store: Store, private route: ActivatedRoute) {
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
