import * as __rxjsTypes from 'rxjs';
import * as __ngrxStore from '@ngrx/store/store';

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { IdeasSelectors } from './ideas.selectors';

@Component({
  selector: 'ci-idea',
  template: `
    <pre>{{ idea$ | async | json }}</pre>
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
  idea$ = this.store.select(IdeasSelectors.selectSelectedIdea);

  constructor(private store: Store) {}
}
