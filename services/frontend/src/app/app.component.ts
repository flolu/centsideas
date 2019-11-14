import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IIdeaViewModel } from '@cents-ideas/models';
import { AppState } from '@ci-frontend/app';
import { IdeasSelectors, IdeasActions } from '@ci-frontend/ideas';

@Component({
  selector: 'ci-root',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  ideas$: Observable<IIdeaViewModel[]> = this.store.select(IdeasSelectors.selectIdeas);

  constructor(private store: Store<AppState>) {
    // TODO move
    this.store.dispatch(IdeasActions.getIdeas());
  }
}
