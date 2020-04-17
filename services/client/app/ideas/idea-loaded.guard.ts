import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, skipWhile, withLatestFrom } from 'rxjs/operators';

import { IdeasSelectors } from './ideas.selectors';
import { IdeasActions } from './ideas.actions';
import { TopLevelFrontendRoutes } from '@centsideas/enums';

@Injectable()
export class IdeaLoadedGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(IdeasSelectors.selectSelectedIdea).pipe(
      withLatestFrom(this.store.select(IdeasSelectors.selectSelectedIdeaId)),
      withLatestFrom(this.store.select(IdeasSelectors.selectIdeasState)),
      skipWhile(data => {
        const idea = data[0][0];
        const ideaId = data[0][1];
        const ideasState = data[1];
        if (!idea && !ideasState.loading) {
          this.store.dispatch(IdeasActions.getIdeaById({ id: ideaId }));
        }
        if (ideasState.error) {
          this.router.navigate([TopLevelFrontendRoutes.Ideas]);
          return false;
        }
        return !idea;
      }),
      map(([[idea]]) => !!idea),
    );
  }
}
