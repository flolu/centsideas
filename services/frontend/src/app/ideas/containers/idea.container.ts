import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '../../app.state';

@Component({
  selector: 'ci-idea',
  template: `
    idea container
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdeaContainer {
  constructor(private store: Store<AppState>) {
    // TODO load idea if not already fetched
  }
}
