import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, skipWhile, withLatestFrom } from 'rxjs/operators';

import { LoadStatus } from '@cic/shared';
import { TopLevelFrontendRoutes } from '@centsideas/enums';
import { IdeasSelectors, IdeasActions } from './store';

@Injectable()
export class IdeaLoadedGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(IdeasSelectors.selectedIdea).pipe(
      withLatestFrom(this.store.select(IdeasSelectors.selectedIdeaId)),
      withLatestFrom(this.store.select(IdeasSelectors.ideasState)),
      skipWhile(data => {
        const idea = data[0][0];
        const ideaId = data[0][1];
        const ideasState = data[1];
        if (!idea && ideasState.pageStatus === LoadStatus.None) {
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