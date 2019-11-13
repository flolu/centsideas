import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { IIdeaViewModel } from '@cents-ideas/models';
import { selectIdeas } from './ideas/ideas.selectors';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { getIdeas } from './ideas/ideas.actions';

@Component({
  selector: 'ci-root',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  ideas$: Observable<IIdeaViewModel[]> = this.store.select(selectIdeas);

  constructor(private store: Store<AppState>) {
    this.store.dispatch(getIdeas());
  }
}
