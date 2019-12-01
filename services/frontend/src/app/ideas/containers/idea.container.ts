import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@ci-frontend/app';
import { IdeasSelectors, IdeasActions } from '..';
import { ActivatedRoute } from '@angular/router';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'ci-idea',
  template: `
    <ci-ideas-card [idea]="idea$ | async"></ci-ideas-card>
    <p>{{ (idea$ | async)?.description }}</p>
    <p>Published at: {{ (idea$ | async)?.publishedAt | date }}</p>
    <ci-reviews></ci-reviews>
  `,
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
          if (!idea) {
            this.store.dispatch(IdeasActions.getIdeaById({ id: this.ideaId }));
          }
        }),
      )
      .subscribe();
  }
}
